"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent, type MouseEvent } from "react";
import {
  ASSISTANT_FALLBACK,
  ASSISTANT_GREETING,
  QUICK_REPLIES,
  type AssistantLink,
} from "@/content/assistant";
import { CONTACT_DETAILS, type ContactInterest } from "@/content/contact";
import { findTopic, onAssistantOpen, wantsBooking } from "@/lib/assistant";
import { navigateToHash } from "@/lib/navigation";
import { keepAiLowercase } from "@/lib/brandText";

/**
 * Ask P.ai — a static, scripted assistant. It answers from the site's own content (see
 * `@/content/assistant`) and books discovery calls by collecting a few details in the chat
 * and sending them through the contact form's endpoint. If that endpoint can't send, it hands
 * the visitor a pre-filled email instead, so no request is lost.
 *
 * The launcher docks in the header at the top of the page and glides down to float in the
 * bottom-right corner once the visitor starts scrolling (always floating on small screens,
 * where the header's right side belongs to the menu button).
 */

interface Message {
  id: number;
  from: "bot" | "user";
  lines: string[];
  links?: AssistantLink[];
  mailto?: string;
}

type BookingStep = "name" | "email" | "company" | "when" | "topic" | "confirm";

interface Booking {
  step: BookingStep;
  name: string;
  email: string;
  company: string;
  when: string;
  topic: string;
  interest: ContactInterest | "";
}

const EMPTY_BOOKING: Booking = { step: "name", name: "", email: "", company: "", when: "", topic: "", interest: "" };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const CANCEL_WORDS = ["cancel", "stop", "never mind", "nevermind", "exit", "quit"];

const STEP_REPLIES: Partial<Record<BookingStep, string[]>> = {
  when: ["This week", "Next week", "Any time works"],
  topic: ["ai strategy", "ai Droplets", "Sovereign ai", "Product demo"],
  confirm: ["Send request", "Start over", "Cancel"],
};

function interestFor(text: string, fallback: ContactInterest | ""): ContactInterest | "" {
  const value = text.toLowerCase();
  if (value.includes("droplet")) return "ai Droplets";
  if (value.includes("sovereign")) return "Sovereign ai";
  if (value.includes("demo") || value.includes("product")) return "Product / accelerator demo";
  if (value.includes("strategy")) return "ai Strategy & Transformation";
  return fallback;
}

export default function AskPai({ visible }: { visible: boolean }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [replies, setReplies] = useState<string[]>(QUICK_REPLIES);
  const [input, setInput] = useState("");
  const [booking, setBooking] = useState<Booking | null>(null);
  const [sending, setSending] = useState(false);
  const [docked, setDocked] = useState(true);
  const nextId = useRef(0);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);

  const say = useCallback((message: Omit<Message, "id">) => {
    setMessages((current) => [...current, { ...message, id: nextId.current++ }]);
  }, []);

  const show = useCallback(() => {
    setOpen(true);
    setMessages((current) => (current.length ? current : [{ id: nextId.current++, from: "bot", lines: ASSISTANT_GREETING }]));
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    launcherRef.current?.focus();
  }, []);

  useEffect(() => onAssistantOpen(show), [show]);

  useEffect(() => {
    const update = () => setDocked(window.scrollY < 40);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  // Newest message in view; the input ready to type into.
  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [messages, open]);

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && close();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  const startBooking = (interest: ContactInterest | "" = "") => {
    setBooking({ ...EMPTY_BOOKING, interest });
    setReplies(["Cancel"]);
    say({ from: "bot", lines: ["Happy to set up a discovery call. It takes four quick questions.", "First, what's your name?"] });
  };

  const sendBooking = async (details: Booking) => {
    setSending(true);
    const message = [
      "Discovery call request via Ask P.ai.",
      `Preferred time: ${details.when}`,
      `Would like to discuss: ${details.topic}`,
    ].join("\n");
    let sent = false;
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: details.name,
          email: details.email,
          company: details.company,
          role: "",
          interest: details.interest,
          message,
          context: "Ask P.ai: discovery call",
          website: "",
        }),
      });
      sent = response.ok;
    } catch {
      sent = false;
    }
    setSending(false);
    setBooking(null);
    setReplies(["What is Pragyan ai?", "Services", "Contact details"]);

    if (sent) {
      say({
        from: "bot",
        lines: [
          `Done, ${details.name}. Your request is with the team.`,
          `They'll reply to ${details.email} to confirm a time that suits you.`,
        ],
      });
      return;
    }
    const subject = encodeURIComponent(`Discovery call request: ${details.company}`);
    const body = encodeURIComponent(`Name: ${details.name}\nWork email: ${details.email}\nCompany: ${details.company}\n\n${message}`);
    say({
      from: "bot",
      lines: [
        "I couldn't send that from here just now. Your details are ready in an email instead; it only needs sending.",
        `You can also call ${CONTACT_DETAILS.phones.filter(Boolean).join(" or ")}.`,
      ],
      mailto: `mailto:${CONTACT_DETAILS.email}?subject=${subject}&body=${body}`,
    });
  };

  /** One step of the booking conversation. */
  const continueBooking = (text: string, current: Booking) => {
    const value = text.trim();
    if (CANCEL_WORDS.includes(value.toLowerCase())) {
      setBooking(null);
      setReplies(QUICK_REPLIES);
      say({ from: "bot", lines: ["No problem, I've cancelled that. Anything else I can help with?"] });
      return;
    }

    const next = { ...current };
    switch (current.step) {
      case "name":
        next.name = value;
        next.step = "email";
        say({ from: "bot", lines: [`Thanks, ${value}. What's your work email?`] });
        break;
      case "email":
        if (!EMAIL_PATTERN.test(value)) {
          say({ from: "bot", lines: ["That doesn't look like an email address. Could you check it?"] });
          return;
        }
        next.email = value;
        next.step = "company";
        say({ from: "bot", lines: ["Which company are you with?"] });
        break;
      case "company":
        next.company = value;
        next.step = "when";
        say({ from: "bot", lines: ["When suits you for a call? A day and rough time is enough, e.g. \"Tuesday afternoon\"."] });
        break;
      case "when":
        next.when = value;
        next.step = "topic";
        say({ from: "bot", lines: ["And what would you like to discuss? One line is fine."] });
        break;
      case "topic":
        next.topic = value;
        next.interest = interestFor(value, current.interest);
        next.step = "confirm";
        say({
          from: "bot",
          lines: [
            "Here's your request:",
            `• Name: ${next.name}`,
            `• Email: ${next.email}`,
            `• Company: ${next.company}`,
            `• Preferred time: ${next.when}`,
            `• Topic: ${next.topic}`,
            "Shall I send it?",
          ],
        });
        break;
      case "confirm": {
        const answer = value.toLowerCase();
        if (answer.startsWith("start")) {
          startBooking(current.interest);
          return;
        }
        if (["send", "send request", "yes", "y", "ok", "okay", "sure", "confirm"].includes(answer)) {
          void sendBooking(current);
          return;
        }
        say({ from: "bot", lines: ["Tap \"Send request\" to send it, \"Start over\" to change something, or \"Cancel\"."] });
        return;
      }
    }
    setBooking(next);
    setReplies(STEP_REPLIES[next.step] ?? ["Cancel"]);
  };

  const answer = (text: string) => {
    if (text === "Request a product demo") {
      startBooking("Product / accelerator demo");
      return;
    }
    const topic = findTopic(text);
    // A topic question outranks a stray booking word ("how do you work with a call centre?").
    if (wantsBooking(text) && (!topic || text.toLowerCase().includes("book"))) {
      startBooking(interestFor(text, ""));
      return;
    }
    if (!topic) {
      setReplies(QUICK_REPLIES);
      say({ from: "bot", lines: ASSISTANT_FALLBACK });
      return;
    }
    setReplies(topic.next ?? QUICK_REPLIES);
    say({ from: "bot", lines: topic.answer, links: topic.links });
  };

  const submit = (text: string) => {
    const value = text.trim();
    if (!value || sending) return;
    say({ from: "user", lines: [value] });
    setInput("");
    if (booking) continueBooking(value, booking);
    else answer(value);
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submit(input);
  };

  const followLink = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    navigateToHash(event, href);
    // On small screens the panel covers the page, so step aside for the section.
    if (window.matchMedia("(max-width: 639.98px)").matches) setOpen(false);
  };

  const inputHint =
    booking?.step === "email" ? "you@company.com" : booking ? "Type your answer…" : "Ask about Pragyan ai, services, booking…";

  return (
    <>
      <button
        ref={launcherRef}
        type="button"
        onClick={show}
        aria-label="Ask P.ai, the site assistant"
        aria-expanded={open}
        aria-controls="ask-pai"
        className={`pai-launcher${visible && !open ? " is-visible" : ""}${docked ? " is-docked" : ""}`}
        tabIndex={visible && !open ? 0 : -1}
      >
        <span aria-hidden="true" className="pai-launcher-dot" />
        <span>
          Ask P.<span className="normal-case">ai</span>
        </span>
      </button>

      <section
        id="ask-pai"
        role="dialog"
        aria-label="Ask P.ai"
        aria-hidden={!open}
        inert={!open}
        className={`pai-panel ${open ? "is-open" : ""}`}
      >
        <header className="pai-head">
          <div className="flex items-center gap-3">
            <span aria-hidden="true" className="pai-avatar">
              P.<span className="normal-case">ai</span>
            </span>
            <div>
              <p className="text-sm font-medium text-[var(--text-primary)]">
                Ask P.<span className="normal-case">ai</span>
              </p>
              <p className="text-[11px] text-[var(--text-muted)]">Pragyan ai assistant</p>
            </div>
          </div>
          <button type="button" onClick={close} aria-label="Close the assistant" className="pai-close" tabIndex={open ? 0 : -1}>
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <div ref={logRef} role="log" aria-live="polite" className="pai-log">
          {messages.map((message) => (
            <div key={message.id} className={message.from === "bot" ? "pai-msg pai-msg-bot" : "pai-msg pai-msg-user"}>
              {message.lines.map((line, index) =>
                line.startsWith("• ") ? (
                  <p key={index} className="pai-bullet">
                    {keepAiLowercase(line.slice(2))}
                  </p>
                ) : (
                  <p key={index}>{keepAiLowercase(line)}</p>
                ),
              )}
              {message.links && (
                <p className="pai-links">
                  {message.links.map((link) => (
                    <a key={link.href} href={link.href} onClick={(event) => followLink(event, link.href)} tabIndex={open ? 0 : -1}>
                      {link.label} <span aria-hidden="true">→</span>
                    </a>
                  ))}
                </p>
              )}
              {message.mailto && (
                <p className="pai-links">
                  <a href={message.mailto} tabIndex={open ? 0 : -1}>
                    Email the request <span aria-hidden="true">→</span>
                  </a>
                </p>
              )}
            </div>
          ))}
          {sending && <p className="pai-msg pai-msg-bot pai-typing">Sending your request…</p>}
        </div>

        {replies.length > 0 && !sending && (
          <div className="pai-replies" aria-label="Suggested replies">
            {replies.map((reply) => (
              <button key={reply} type="button" onClick={() => submit(reply)} className="pai-chip" tabIndex={open ? 0 : -1}>
                {keepAiLowercase(reply)}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={onSubmit} noValidate className="pai-form">
          <label htmlFor="pai-input" className="sr-only">
            Message P.ai
          </label>
          <input
            ref={inputRef}
            id="pai-input"
            type={booking?.step === "email" ? "email" : "text"}
            autoComplete={booking?.step === "email" ? "email" : booking?.step === "name" ? "name" : "off"}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={inputHint}
            maxLength={500}
            disabled={sending}
            tabIndex={open ? 0 : -1}
            className="pai-input"
          />
          <button type="submit" aria-label="Send" disabled={!input.trim() || sending} className="pai-send" tabIndex={open ? 0 : -1}>
            <span aria-hidden="true">→</span>
          </button>
        </form>
      </section>
    </>
  );
}
