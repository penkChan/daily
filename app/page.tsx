"use client";
import Card from "@/components/Card";
import { BookOpenCheck } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
export default function Home() {
  const [email, setEmail] = useState("");
  const handleSubscribe = () => {
    if (email === undefined || email.trim() === "") {
      toast.error("Email is required");
      return;
    }
    fetch("/api/subscribe", {
      method: "POST",
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success("Subscribed successfully");
        }
      })
      .catch((error) => {
        console.log(error);
        toast.error("Failed to subscribe");
      })
      .finally(() => {
        setEmail("");
      });
  };
  return (
    <div className="min-h-screen bg-white">
      <header className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <BookOpenCheck />
          <h1 className="text-2xl font-bold">Daily News</h1>
        </div>
        <nav className="flex items-center gap-6">
          <Link href="/" className="hover:text-gray-500">
            About
          </Link>
          <Link href="/" className="hover:text-gray-500">
            Contact
          </Link>
        </nav>
      </header>
      {/* main content */}
      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* title */}
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">Daily Briefs of AI</h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto leading-relaxed">
            Discover the latest news from around the world, powered by AI.
          </p>
        </div>
        {/* input subscribe  button */}
        <div className="text-center flex items-center justify-center gap-4">
          <input
            type="email"
            placeholder="Enter your emial"
            className="w-full max-w-md p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button
            className="bg-black text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onClick={handleSubscribe}
          >
            Subscribe
          </button>
        </div>
        {/* cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
          <Card title="AI" description="lasts news from around the world" />
          <Card
            title="Startups"
            description="Bussiness news from around the world"
          />
          <Card title="Tech" description="Latest news from around the world" />
        </div>
      </div>
    </div>
  );
}
