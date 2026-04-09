import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const domain = searchParams.get("domain") || "stmarks.instructure.com";
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json(
      { error: "Canvas access token required" },
      { status: 400 }
    );
  }

  try {
    // Get user's courses first
    const coursesRes = await fetch(
      `https://${domain}/api/v1/courses?enrollment_state=active&per_page=20`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!coursesRes.ok) {
      if (coursesRes.status === 401) {
        return NextResponse.json(
          { error: "Invalid Canvas token. Please update in settings." },
          { status: 401 }
        );
      }
      throw new Error(`Canvas API error: ${coursesRes.status}`);
    }

    const courses = await coursesRes.json();

    // Get upcoming assignments for each course (next 7 days)
    const now = new Date();
    const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const assignmentPromises = courses.map(
      async (course: { id: number; name: string }) => {
        try {
          const res = await fetch(
            `https://${domain}/api/v1/courses/${course.id}/assignments?` +
              `order_by=due_at&` +
              `bucket=upcoming&` +
              `per_page=10&` +
              `include[]=submission`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          if (!res.ok) return [];
          const assignments = await res.json();
          return assignments
            .filter(
              (a: { due_at: string | null }) =>
                a.due_at &&
                new Date(a.due_at) >= now &&
                new Date(a.due_at) <= weekLater
            )
            .map(
              (a: {
                id: number;
                name: string;
                due_at: string | null;
                html_url: string;
                points_possible: number | null;
                submission?: {
                  submitted_at: string | null;
                  workflow_state: string;
                };
              }) => ({
                id: a.id,
                name: a.name,
                due_at: a.due_at,
                course_name: course.name,
                html_url: a.html_url,
                points_possible: a.points_possible,
                submission: a.submission
                  ? {
                      submitted_at: a.submission.submitted_at,
                      workflow_state: a.submission.workflow_state,
                    }
                  : undefined,
              })
            );
        } catch {
          return [];
        }
      }
    );

    const results = await Promise.all(assignmentPromises);
    const allAssignments = results
      .flat()
      .sort(
        (a: { due_at: string | null }, b: { due_at: string | null }) =>
          new Date(a.due_at || 0).getTime() - new Date(b.due_at || 0).getTime()
      );

    return NextResponse.json(allAssignments);
  } catch {
    return NextResponse.json(
      { error: "Failed to connect to Canvas" },
      { status: 500 }
    );
  }
}
