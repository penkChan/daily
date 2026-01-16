import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: Request) {
  const { email } = await request.json();
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error: createEerror } = await resend.contacts.create({
    email,
  });
  if (createEerror) {
    return NextResponse.json({ error: createEerror.message }, { status: 500 });
  }

  const { error: addError } = await resend.contacts.segments.add({
    email,
    segmentId: process.env.RESEND_SEGMENT_ID as string,
  });
  if (addError) {
    console.log(addError);
    return NextResponse.json({ error: addError.message }, { status: 500 });
  }

  return NextResponse.json(
    { message: "Subscribe successfully" },
    { status: 200 }
  );
}
