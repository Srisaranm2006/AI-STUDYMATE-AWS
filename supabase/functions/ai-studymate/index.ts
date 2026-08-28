import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RequestBody {
  action: "answer" | "mcq" | "revision" | "tutor";
  subject?: string;
  topic?: string;
  answerType?: string;
  difficulty?: string;
  count?: number;
  question?: string;
  history?: { role: "user" | "assistant"; content: string }[];
}

// Whether a real Bedrock/AI provider is configured. When false, the function
// returns rich, realistic demo responses so the app is fully functional for
// the showcase without any cloud credentials.
const bedrockConfigured =
  !!Deno.env.get("AWS_BEDROCK_MODEL_ID") &&
  !!Deno.env.get("AWS_ACCESS_KEY_ID");

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as RequestBody;
    const { action } = body;

    let result: unknown;
    let demo = true;

    if (bedrockConfigured) {
      // Real Amazon Bedrock integration point.
      // Replace the demo generator below with a call to Bedrock's InvokeModel API
      // using the AWS SDK, passing the structured prompt for the action.
      // result = await callBedrock(body);
      // demo = false;
      result = generateDemo(body);
    } else {
      result = generateDemo(body);
    }

    return new Response(
      JSON.stringify({ ok: true, demo, data: result }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ ok: false, error: err?.message ?? "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// ---------------------------------------------------------------------------
// Demo response generator
// Produces realistic, structured study content for showcase/demo mode.
// ---------------------------------------------------------------------------

function generateDemo(body: RequestBody): unknown {
  const subject = body.subject?.trim() || "General";
  const topic = body.topic?.trim() || "this topic";
  const difficulty = body.difficulty || "Intermediate";

  switch (body.action) {
    case "answer":
      return generateAnswer(topic, body.answerType || "5", difficulty);
    case "mcq":
      return generateMcqs(subject, topic, body.count ?? 5, difficulty);
    case "revision":
      return generateRevision(subject, topic);
    case "tutor":
      return generateTutorReply(body.question || "", body.history ?? []);
    default:
      throw new Error("Unknown action");
  }
}

function generateAnswer(topic: string, answerType: string, difficulty: string) {
  const t = capitalize(topic);
  if (answerType === "2") {
    return {
      title: `${t} — 2-Mark Answer`,
      sections: [
        { heading: "Definition", body: `${t} refers to ${describe(topic)}. It is a key concept studied under ${field(topic)} and is widely used in modern systems.` },
        { heading: "Key Points", bullets: [
          `It enables ${benefit(topic)}.`,
          `It is commonly applied where ${useCase(topic)}.`,
          `Its main advantage is ${advantage(topic)}.`,
        ]},
      ],
    };
  }
  if (answerType === "13") {
    return {
      title: `${t} — 13-Mark Answer`,
      sections: [
        { heading: "Introduction", body: `In the study of ${field(topic)}, ${t} plays a central role. This answer explains the concept, its working principle, advantages, applications, and an example.` },
        { heading: "Definition", body: `${t} is defined as ${describe(topic)}.` },
        { heading: "Detailed Explanation", body: `${t} works by ${explain(topic)}. At a ${difficulty.toLowerCase()} level, it is important to understand both the underlying mechanism and the trade-offs involved. The concept builds on foundational principles of ${field(topic)} and extends them to address real-world constraints such as performance, scalability, and reliability.` },
        { heading: "Working / Principle", body: `The working principle of ${t} involves ${working(topic)}. Each component cooperates to achieve the overall goal, and the flow of data/control is carefully orchestrated.` },
        { heading: "Advantages", bullets: [
          `Improved efficiency compared to traditional approaches.`,
          `Scalability — supports growth in users or data.`,
          `Flexibility — adapts to different deployment scenarios.`,
          `Better resource utilization.`,
        ]},
        { heading: "Applications", bullets: [
          `Used in ${useCase(topic)}.`,
          `Deployed in enterprise and consumer products.`,
          `Foundational to modern ${field(topic)} systems.`,
        ]},
        { heading: "Example", body: `A practical example of ${t} is ${example(topic)}. This demonstrates how the concept is realized in a real system.` },
        { heading: "Conclusion", body: `${t} is a vital concept in ${field(topic)} that combines theoretical principles with practical engineering. Understanding it provides a strong foundation for advanced study and real-world application.` },
      ],
    };
  }
  // 5-mark default
  return {
    title: `${t} — 5-Mark Answer`,
    sections: [
      { heading: "Introduction", body: `${t} is an important concept in ${field(topic)}. It allows ${benefit(topic)} and is widely studied in engineering and computer science courses.` },
      { heading: "Main Points", bullets: [
        `Definition: ${describe(topic)}.`,
        `Working: ${working(topic)}.`,
        `It is used for ${useCase(topic)}.`,
      ]},
      { heading: "Example", body: `For example, ${example(topic)}.` },
      { heading: "Conclusion", body: `Thus, ${t} is a key technique in ${field(topic)} that offers clear advantages and broad applicability.` },
    ],
  };
}

function generateMcqs(subject: string, topic: string, count: number, difficulty: string) {
  const t = capitalize(topic);
  const base = [
    {
      question: `What is the primary purpose of ${topic}?`,
      options: [describe(topic), "To reduce hardware cost only", "To replace all networking", "To slow down systems"],
      correct: 0,
      explanation: `${t} is primarily about ${benefit(topic)}.`,
    },
    {
      question: `Which field is most associated with ${topic}?`,
      options: ["Civil Engineering", field(topic), "Mechanical Engineering", "Agriculture"],
      correct: 1,
      explanation: `${t} falls under ${field(topic)}.`,
    },
    {
      question: `A key advantage of ${topic} is:`,
      options: [advantage(topic), "Higher latency", "More power consumption", "Reduced security"],
      correct: 0,
      explanation: `${t} improves ${benefit(topic)}.`,
    },
    {
      question: `${t} is commonly applied in:`,
      options: [useCase(topic), "Cooking", "Painting", "Carpentry"],
      correct: 0,
      explanation: `Real-world application: ${useCase(topic)}.`,
    },
    {
      question: `Which best describes the working of ${topic}?`,
      options: [working(topic), "Random behavior", "No data flow", "Manual only"],
      correct: 0,
      explanation: `The principle involves ${working(topic)}.`,
    },
    {
      question: `An example of ${topic} is:`,
      options: [example(topic), "A wooden table", "A paper notebook", "A bicycle wheel"],
      correct: 0,
      explanation: `Example: ${example(topic)}.`,
    },
    {
      question: `At ${difficulty} level, ${topic} requires understanding of:`,
      options: [`Both theory and practical trade-offs`, "Only theory", "Only memorization", "Nothing"],
      correct: 0,
      explanation: `A solid grasp combines theory with real-world application.`,
    },
    {
      question: `Which is a disadvantage/limitation of ${topic}?`,
      options: ["Implementation complexity in some scenarios", "It is free always", "No setup needed", "Works with zero resources"],
      correct: 0,
      explanation: `Like most systems, ${t} has trade-offs around complexity.`,
    },
    {
      question: `${t} improves which aspect most directly?`,
      options: ["Efficiency / performance", "Color accuracy of prints", "Taste of food", "Sound of instruments"],
      correct: 0,
      explanation: `The core benefit is ${benefit(topic)}.`,
    },
    {
      question: `Which statement about ${topic} is TRUE?`,
      options: [`It is widely used in ${field(topic)}`, "It only works offline", "It has no standards", "It cannot be scaled"],
      correct: 0,
      explanation: `${t} is a standard concept in ${field(topic)}.`,
    },
  ];
  const qs = base.slice(0, Math.min(count, base.length)).map((q, i) => ({ id: i + 1, ...q, subject, topic, difficulty }));
  return { questions: qs, total: qs.length };
}

function generateRevision(subject: string, topic: string) {
  const t = capitalize(topic);
  return {
    title: `Quick Revision — ${t}`,
    sections: [
      { heading: "Important Definitions", bullets: [
        `${t}: ${describe(topic)}`,
        `Related term: a foundational concept in ${field(topic)}.`,
      ]},
      { heading: "Key Points", bullets: [
        `Enables ${benefit(topic)}.`,
        `Works by ${working(topic)}.`,
        `Applied where ${useCase(topic)}.`,
        `Main advantage: ${advantage(topic)}.`,
      ]},
      { heading: "Important Formulas", bullets: [
        `Performance metric ∝ efficiency / resource usage (conceptual).`,
        `Throughput = (successful operations) / (total time).`,
      ]},
      { heading: "Important Concepts", bullets: [
        `Scalability and reliability are core design goals.`,
        `Trade-off between complexity and performance.`,
        `Standards ensure interoperability across systems.`,
      ]},
      { heading: "Real-World Applications", bullets: [
        `${example(topic)}`,
        `Enterprise and consumer products in ${field(topic)}.`,
      ]},
      { heading: "Last-Minute Revision Points", bullets: [
        `Definition + one key advantage = 2 marks.`,
        `Working principle + one example = 5 marks.`,
        `Intro, definition, explanation, advantages, applications, example, conclusion = 13 marks.`,
      ]},
    ],
  };
}

function generateTutorReply(question: string, history: { role: string; content: string }[]) {
  const q = question.trim() || "this topic";
  const t = capitalize(q.replace(/^(what is|what's|explain|define|how does|how do)\s+/i, "").replace(/\?$/, ""));
  return {
    reply: `Great question! Let me explain ${t} in simple terms.\n\n${t} is basically ${describe(q)}. Think of it like this: ${analogy(q)}.\n\nIn simple words, it works by ${working(q)}. The main reason we use it is because ${benefit(q)}.\n\nA real-life example: ${example(q)}.\n\nKey takeaway: ${t} helps us ${advantage(q)}. If you'd like, I can go deeper or give you a quick quiz on this!`,
  };
}

// ---------------------------------------------------------------------------
// Content helpers — produce realistic, topic-aware demo text.
// ---------------------------------------------------------------------------

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function field(topic: string): string {
  const t = topic.toLowerCase();
  if (/(5g|network|wireless|slicing|cellular|lte)/.test(t)) return "Wireless Communication";
  if (/(iot|sensor|smart device|embedded)/.test(t)) return "Internet of Things";
  if (/(microcontroller|arduino|pic|stm32|8051)/.test(t)) return "Embedded Systems";
  if (/(cloud|aws|azure|s3|lambda|serverless)/.test(t)) return "Cloud Computing";
  if (/(ai|machine learning|ml|neural|deep learning|artificial intelligence)/.test(t)) return "Artificial Intelligence";
  if (/(database|sql|nosql|data)/.test(t)) return "Database Systems";
  if (/(network|tcp|ip|routing|switch)/.test(t)) return "Computer Networks";
  if (/(os|operating system|process|scheduling|memory)/.test(t)) return "Operating Systems";
  return "Computer Science";
}

function describe(topic: string): string {
  const t = topic.toLowerCase();
  if (t.includes("network slicing")) return "a 5G technology that splits a single physical network into multiple virtual networks, each optimized for a specific use case";
  if (t.includes("iot")) return "a network of physical devices embedded with sensors and software that exchange data over the internet";
  if (t.includes("microcontroller")) return "a compact integrated circuit designed to perform a specific embedded task, combining a processor, memory, and I/O peripherals";
  if (t.includes("cloud computing")) return "the delivery of computing services — servers, storage, databases, networking, software — over the internet on demand";
  if (t.includes("artificial intelligence") || t === "ai") return "the simulation of human intelligence in machines that can learn, reason, and make decisions";
  if (t.includes("embedded system")) return "a dedicated computer system designed to perform specific tasks within a larger mechanical or electrical system";
  if (t.includes("5g")) return "the fifth generation of cellular network technology, offering high speed, low latency, and massive device connectivity";
  return `a key concept in ${field(topic)} that addresses a specific technical challenge through structured design`;
}

function benefit(topic: string): string {
  const t = topic.toLowerCase();
  if (t.includes("network slicing")) return "dedicated network resources for different services on the same infrastructure";
  if (t.includes("iot")) return "devices to communicate and share data automatically";
  if (t.includes("microcontroller")) return "compact, low-power control of embedded devices";
  if (t.includes("cloud")) return "on-demand, scalable computing resources without owning hardware";
  if (t.includes("ai") || t.includes("artificial")) return "machines to perform tasks that normally require human intelligence";
  if (t.includes("embedded")) return "reliable, real-time control within a larger system";
  return "efficient and scalable solutions to real engineering problems";
}

function working(topic: string): string {
  const t = topic.toLowerCase();
  if (t.includes("network slicing")) return "dividing the physical network into virtual slices using network function virtualization (NFV) and software-defined networking (SDN), each slice with its own quality of service";
  if (t.includes("iot")) return "collecting data from sensors, transmitting it via connectivity (Wi-Fi, cellular, Zigbee), processing it in the cloud, and acting on the results";
  if (t.includes("microcontroller")) return "executing stored program instructions, reading inputs from sensors, processing them, and controlling outputs like motors or displays";
  if (t.includes("cloud")) return "provisioning virtualized resources on demand over the internet, scaling up or down based on usage";
  if (t.includes("ai") || t.includes("artificial")) return "training models on large datasets so they learn patterns, then using those models to make predictions or decisions on new data";
  if (t.includes("embedded")) return "running dedicated firmware that reads inputs, processes them in real time, and controls outputs within the host system";
  return "coordinating components according to defined rules to achieve the intended behavior";
}

function advantage(topic: string): string {
  const t = topic.toLowerCase();
  if (t.includes("network slicing")) return "efficient use of infrastructure with service-specific guarantees";
  if (t.includes("iot")) return "automation and real-time monitoring at scale";
  if (t.includes("microcontroller")) return "low cost and low power for dedicated tasks";
  if (t.includes("cloud")) return "pay-as-you-go scalability with no upfront hardware investment";
  if (t.includes("ai") || t.includes("artificial")) return "automating complex decisions and discovering patterns in data";
  if (t.includes("embedded")) return "reliable, deterministic performance for critical tasks";
  return "improved performance and flexibility";
}

function useCase(topic: string): string {
  const t = topic.toLowerCase();
  if (t.includes("network slicing")) return "ultra-reliable low-latency communications, massive IoT, and enhanced mobile broadband";
  if (t.includes("iot")) return "smart homes, industrial automation, and connected healthcare";
  if (t.includes("microcontroller")) return "consumer electronics, automotive control, and robotics";
  if (t.includes("cloud")) return "web hosting, big-data analytics, and enterprise applications";
  if (t.includes("ai") || t.includes("artificial")) return "recommendation systems, image recognition, and natural language processing";
  if (t.includes("embedded")) return "medical devices, automotive systems, and industrial controllers";
  return "modern engineering and consumer products";
}

function example(topic: string): string {
  const t = topic.toLowerCase();
  if (t.includes("network slicing")) return "a telecom operator running one slice for autonomous vehicles (low latency) and another for video streaming (high bandwidth) on the same 5G network";
  if (t.includes("iot")) return "a smart thermostat that senses room temperature and adjusts cooling via a cloud-connected app";
  if (t.includes("microcontroller")) return "an Arduino-based home automation controller that switches lights based on sensor input";
  if (t.includes("cloud")) return "a startup hosting its web app on AWS Lambda + S3, scaling automatically during traffic spikes";
  if (t.includes("ai") || t.includes("artificial")) return "an email provider using AI to filter spam by learning from millions of labeled messages";
  if (t.includes("embedded")) return "an anti-lock braking system (ABS) in a car that uses an embedded controller to prevent wheel lock";
  return `a real system in ${field(topic)} that uses this concept to deliver its core function`;
}

function analogy(topic: string): string {
  const t = topic.toLowerCase();
  if (t.includes("network slicing")) return "a highway divided into lanes — each lane serves different traffic (trucks vs. fast cars) but they share the same road";
  if (t.includes("iot")) return "your body's nervous system — sensors detect changes and send signals to a brain (cloud) that decides what to do";
  if (t.includes("microcontroller")) return "the conductor of a small orchestra — it reads the score (program) and tells each instrument (component) what to do";
  if (t.includes("cloud")) return "renting electricity from the grid instead of building your own power plant — you pay for what you use";
  if (t.includes("ai") || t.includes("artificial")) return "a student who studies past exam papers to recognize patterns and answer new questions";
  if (t.includes("embedded")) return "the autopilot in a drone — a dedicated computer that constantly adjusts to keep it flying";
  return "a tool designed to do one job very well within a bigger system";
}
