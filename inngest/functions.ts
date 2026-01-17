import { Resend } from "resend";
import { fetchAllNews, formatNewsSummary } from "@/lib/rss_utils";
import { inngest } from "./client";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: `Hello ${event.data.email}!` };
  }
);

export const sendDailyNews = inngest.createFunction(
  { id: "send-daily-news" },
  // { event: "test/send.daily.news" },
  { cron: "15 4 * * *" }, // 每天早上12点 UTC 时间
  async ({ event, step }) => {
    // 1. 从多个RSS源获取新闻
    const newsItems = await step.run("fetch-news", async () => {
      console.log("Fetching news...");
      const news = await fetchAllNews();
      console.log("News fetched:", news.length);
      return news;
    });
    // 2. 整理为每日摘要
    const newsSummary = await step.run("format-news-summary", async () => {
      console.log("Formatting news summary...");
      const summery = formatNewsSummary(newsItems);
      console.log("News summary:", summery);
      return summery;
    });
    // 3. 创建邮件内容
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { data, error } = await step.run("create-email", async () => {
      const result = await resend.broadcasts.create({
        from: "Daily Briefs <onboarding@resend.dev>",
        segmentId: process.env.RESEND_SEGMENT_ID as string,
        subject: `Daily Briefs - ${new Date().toLocaleDateString("zh-CN", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`,
        html: newsSummary.html,
        text: "123",
      });
      return result;
    });
    if (data === null) {
      throw new Error("Error sending email: " + error.message);
    }
    // 4. 发送邮件
    const { error: sendError } = await step.run("send-email", async () => {
      const result = await resend.broadcasts.send(data.id);
      return result;
    });
    if (sendError) {
      return { error: sendError.message };
    }
    return { message: "Email sent successfully!" };
  }
);
