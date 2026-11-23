/* Mohikontok Sound Lab — FAQ chatbot widget.
   Pure client-side: no backend, no tracking, no data leaves the page.
   Answers come only from the knowledge base below — real studio facts:
   Room A/B $65/hr, 2-hour minimum, 25% off first visit, mixing from
   $250/song, mastering from $75/song, sessions 10 AM–10 PM daily,
   1389 Kearney Ave, Bronx, NY 10465, (551) 266-3479, studio@mohikontok.com.
   To add or change an answer, edit the KB array and bump the ?v= on the
   script tag in each page. */
(function () {
  "use strict";

  var BOOK_URL = "https://calendar.app.google/aSw6EhaGa6Dt6Zwg6";
  var PHONE_TEL = "tel:+15512663479";
  var MAPS_URL = "https://www.google.com/maps/search/?api=1&query=1389+Kearney+Ave+Bronx+NY+10465";

  var KB = [
    {
      id: "greeting",
      keys: ["hello", "hi", "hey", "salam", "assalam", "namaskar", "good morning", "good afternoon", "good evening", "নমস্কার", "হ্যালো", "সালাম", "আসসালাম"],
      en: "Hello! I\u2019m the Sound Lab assistant. Ask me about prices, rooms, booking, hours, or location \u2014 or tap a button below.",
      bn: "নমস্কার! আমি সাউন্ড ল্যাবের সহকারী। দাম, রুম, বুকিং, সময় বা ঠিকানা সম্পর্কে জিজ্ঞেস করুন \u2014 অথবা নিচের বোতামে চাপ দিন।"
    },
    {
      id: "thanks",
      keys: ["thank", "thanks", "thx", "ধন্যবাদ"],
      en: "You\u2019re welcome! Anything else \u2014 prices, booking, hours?",
      bn: "আপনাকে স্বাগতম! আর কিছু জানতে চান \u2014 দাম, বুকিং, সময়?"
    },
    {
      id: "prices",
      keys: ["price", "pricing", "cost", "rate", "rates", "how much", "charge", "fee", "fees", "expensive", "cheap", "দাম", "খরচ", "মূল্য", "ভাড়া", "কত"],
      en: "Room A and Room B are both $65/hr, with a 2-hour minimum. In-house session musicians are +$30/hr. Mixing starts at $250/song and mastering at $75/song. First visit gets 25% off.",
      bn: "রুম A ও রুম B \u2014 দুটোই $65/ঘণ্টা, সর্বনিম্ন ২ ঘণ্টা। ইন-হাউস সেশন মিউজিশিয়ান +$30/ঘণ্টা। মিক্সিং $250/গান থেকে, মাস্টারিং $75/গান থেকে। প্রথম ভিজিটে ২৫% ছাড়।",
      action: { en: "Book a session", bn: "বুক করুন", href: BOOK_URL }
    },
    {
      id: "rooms",
      keys: ["room", "rooms", "room a", "room b", "space", "spaces", "রুম"],
      en: "Room A \u2014 Main Performance Studio: full-ensemble tracking in the main live room, white-brick wall. Room B \u2014 Vocal & Podcast Suite: vocals, podcast and voiceover in a focused suite, red-and-black foam walls. Both $65/hr.",
      bn: "রুম A \u2014 মেইন পারফরম্যান্স স্টুডিও: পুরো ব্যান্ড/এনসেম্বল রেকর্ডিং, সাদা ইটের দেয়াল। রুম B \u2014 ভোকাল ও পডকাস্ট স্যুট: ভোকাল, পডকাস্ট ও ভয়েসওভার, লাল-কালো ফোমের দেয়াল। দুটোই $65/ঘণ্টা।"
    },
    {
      id: "booking",
      keys: ["book", "booking", "reserve", "reservation", "appointment", "schedule", "session", "available", "availability", "slot", "বুক", "বুকিং", "রিজার্ভ"],
      en: "You can book instantly on our live calendar \u2014 2-hour sessions, 10 AM to 10 PM, seven days a week. Or call (551) 266-3479 and our booking assistant will hold your session.",
      bn: "আমাদের লাইভ ক্যালেন্ডারে সরাসরি বুক করতে পারেন \u2014 ২ ঘণ্টার সেশন, সকাল ১০টা থেকে রাত ১০টা, সপ্তাহে সাত দিন। অথবা (551) 266-3479 নম্বরে কল করুন \u2014 বুকিং সহকারী আপনার সেশন ধরে রাখবেন।",
      action: { en: "Book online", bn: "অনলাইনে বুক করুন", href: BOOK_URL }
    },
    {
      id: "hours",
      keys: ["hour", "hours", "open", "opening", "close", "closing", "when", "time", "timing", "সময়", "খোলা", "কখন"],
      en: "We\u2019re open 24/7. Bookable sessions run 10 AM to 10 PM, seven days a week.",
      bn: "আমরা ২৪/৭ খোলা। বুকিং করা যায় সকাল ১০টা থেকে রাত ১০টা, সপ্তাহে সাত দিন।"
    },
    {
      id: "location",
      keys: ["location", "address", "where", "direction", "directions", "map", "parking", "subway", "train", "bus", "ঠিকানা", "কোথায়", "লোকেশন"],
      en: "1389 Kearney Ave, Bronx, NY 10465 \u2014 in the Country Club area of the Bronx.",
      bn: "1389 Kearney Ave, Bronx, NY 10465 \u2014 ব্রঙ্কসের কান্ট্রি ক্লাব এলাকায়।",
      action: { en: "Open in Maps", bn: "ম্যাপে দেখুন", href: MAPS_URL }
    },
    {
      id: "mixing",
      keys: ["mix", "mixing", "mixdown", "মিক্স", "মিক্সিং"],
      en: "Mixing starts at $250/song. Bring your tracks or record them here \u2014 our engineers mix in the studio.",
      bn: "মিক্সিং $250/গান থেকে শুরু। আপনার ট্র্যাক আনুন বা এখানেই রেকর্ড করুন \u2014 আমাদের ইঞ্জিনিয়াররা স্টুডিওতে মিক্স করেন।"
    },
    {
      id: "mastering",
      keys: ["master", "mastering", "মাস্টার", "মাস্টারিং"],
      en: "Mastering starts at $75/song.",
      bn: "মাস্টারিং $75/গান থেকে শুরু।"
    },
    {
      id: "rehearsal",
      keys: ["rehears", "rehearsal", "practice", "band", "jam", "run-through", "রিহার্সাল", "ব্যান্ড", "প্র্যাকটিস"],
      en: "Book a room by the hour for band rehearsal, run-throughs and practice \u2014 $65/hr, 2-hour minimum. Room A fits a full band.",
      bn: "ব্যান্ড রিহার্সাল ও প্র্যাকটিসের জন্য ঘণ্টা হিসেবে রুম বুক করুন \u2014 $65/ঘণ্টা, সর্বনিম্ন ২ ঘণ্টা। রুম A-তে পুরো ব্যান্ড ধরে।"
    },
    {
      id: "podcast",
      keys: ["podcast", "voiceover", "voice over", "voice", "narration", "spoken", "poetry", "recit", "পডকাস্ট", "কবিতা", "আবৃত্তি", "ভয়েস"],
      en: "Room B is our Vocal & Podcast Suite \u2014 made for podcast, voiceover and spoken poetry, including Bengali recitation. $65/hr.",
      bn: "রুম B আমাদের ভোকাল ও পডকাস্ট স্যুট \u2014 পডকাস্ট, ভয়েসওভার ও কবিতা আবৃত্তির জন্য, বাংলা আবৃত্তিসহ। $65/ঘণ্টা।"
    },
    {
      id: "discount",
      keys: ["discount", "offer", "first visit", "first time", "coupon", "deal", "promo", "ছাড়", "অফার", "প্রথম"],
      en: "First visit to the studio gets 25% off your session.",
      bn: "স্টুডিওতে প্রথম ভিজিটে আপনার সেশনে ২৫% ছাড়।"
    },
    {
      id: "musicians",
      keys: ["musician", "musicians", "session musician", "tabla", "drums", "keys", "keyboard", "guitar", "instrument", "percussion", "তবলা", "মিউজিশিয়ান"],
      en: "In-house session musicians are +$30/hr: Roland HandSonic HPD-20 percussion/tabla, Yamaha MX49 keys, MIDI guitar, 7-string electric, bass, and acoustic chimes.",
      bn: "ইন-হাউস সেশন মিউজিশিয়ান +$30/ঘণ্টা: Roland HandSonic HPD-20 পারকাশন/তবলা, Yamaha MX49 কিবোর্ড, MIDI গিটার, ৭-স্ট্রিং ইলেকট্রিক, বেস ও অ্যাকোস্টিক চাইম।"
    },
    {
      id: "copyright",
      keys: ["copyright", "isrc", "upc", "distribution", "release", "rights", "master rights", "royalt", "কপিরাইট", "ডিস্ট্রিবিউশন"],
      en: "Artists keep 100% of their master rights. We also offer an ISRC/UPC package \u2014 $100 flat per release (finished audio up to 5 minutes + cover art) \u2014 for worldwide distribution.",
      bn: "শিল্পীরা তাদের মাস্টার রাইটসের ১০০% নিজের কাছে রাখেন। ISRC/UPC প্যাকেজও আছে \u2014 প্রতি রিলিজে ফ্ল্যাট $100 (৫ মিনিট পর্যন্ত ফিনিশড অডিও + কভার আর্ট) \u2014 বিশ্বব্যাপী ডিস্ট্রিবিউশনের জন্য।"
    },
    {
      id: "contact",
      keys: ["contact", "call", "phone", "email", "reach", "talk", "human", "person", "someone", "যোগাযোগ", "ফোন", "কল", "ইমেইল"],
      en: "Call (551) 266-3479 or email studio@mohikontok.com. Our booking assistant answers calls and holds sessions.",
      bn: "কল করুন (551) 266-3479 অথবা ইমেইল করুন studio@mohikontok.com। বুকিং সহকারী কলে উত্তর দেন ও সেশন ধরে রাখেন।",
      action: { en: "Call now", bn: "এখনই কল করুন", href: PHONE_TEL }
    },
    {
      id: "bengali",
      keys: ["bengali", "bangla", "bangladesh", "rabindra", "nazrul", "jibanananda", "tagore", "বাংলা", "রবীন্দ্র", "নজরুল", "জীবনানন্দ"],
      en: "Yes \u2014 we record Bengali songs, poetry recitation and drama, from Rabindra Sangeet and Nazrul to Jibanananda Das. Our catalog is building into a large archive of Bangla content recorded in the Bronx.",
      bn: "হ্যাঁ \u2014 আমরা বাংলা গান, কবিতা আবৃত্তি ও নাটক রেকর্ড করি \u2014 রবীন্দ্রসঙ্গীত, নজরুল থেকে জীবনানন্দ দাশ পর্যন্ত। আমাদের ক্যাটালগ ব্রঙ্কসে রেকর্ড করা বাংলা কনটেন্টের একটি বড় আর্কাইভ হয়ে উঠছে।"
    },
    {
      id: "about",
      keys: ["about", "who are you", "what is", "mohikontok", "sound lab", "studio", "সম্পর্কে"],
      en: "Mohikontok Sound Lab is a recording studio in the Bronx \u2014 record, rehearse and meet. We record music, spoken poetry, podcasts and voiceover in English and Bengali.",
      bn: "মহিকণ্টক সাউন্ড ল্যাব ব্রঙ্কসের একটি রেকর্ডিং স্টুডিও \u2014 রেকর্ড, রিহার্সাল ও মিটিং। আমরা ইংরেজি ও বাংলায় গান, কবিতা আবৃত্তি, পডকাস্ট ও ভয়েসওভার রেকর্ড করি।"
    }
  ];

  var FALLBACK = {
    en: "I can help with prices, rooms, booking, hours, location, mixing, mastering, rehearsal, podcast recording, and contact details. Try one of the buttons below \u2014 or call (551) 266-3479.",
    bn: "আমি দাম, রুম, বুকিং, সময়, ঠিকানা, মিক্সিং, মাস্টারিং, রিহার্সাল, পডকাস্ট রেকর্ডিং ও যোগাযোগের বিষয়ে সাহায্য করতে পারি। নিচের বোতামগুলোর একটি চাপ দিন \u2014 অথবা কল করুন (551) 266-3479।"
  };

  var CHIPS = {
    en: ["Prices", "Book a session", "Hours", "Where are you?"],
    bn: ["দাম", "বুকিং", "সময়", "ঠিকানা"]
  };

  var UI = {
    en: { title: "Sound Lab Assistant", subtitle: "Answers about prices, booking & hours", placeholder: "Ask about the studio\u2026", send: "Send", langBtn: "বাংলা", close: "Close chat", open: "Open chat" },
    bn: { title: "সাউন্ড ল্যাব সহকারী", subtitle: "দাম, বুকিং ও সময় সম্পর্কে জানুন", placeholder: "স্টুডিও সম্পর্কে জিজ্ঞেস করুন\u2026", send: "পাঠান", langBtn: "EN", close: "চ্যাট বন্ধ করুন", open: "চ্যাট খুলুন" }
  };

  var BENGALI_RE = /[\u0980-\u09FF]/;

  function normalize(s) { return (s || "").toLowerCase().replace(/\s+/g, " ").trim(); }

  function findAnswer(text) {
    var norm = normalize(text);
    var best = null, bestScore = 0;
    for (var i = 0; i < KB.length; i++) {
      var score = 0;
      for (var j = 0; j < KB[i].keys.length; j++) {
        if (norm.indexOf(KB[i].keys[j]) !== -1) score++;
      }
      if (score > bestScore) { bestScore = score; best = KB[i]; }
    }
    return best;
  }

  function build() {
    var launcher = document.createElement("button");
    launcher.className = "msl-chat-launcher";
    launcher.type = "button";
    launcher.setAttribute("aria-label", UI.en.open);
    launcher.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20 2H4a2 2 0 0 0-2 2v18l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM8 9h8v2H8V9zm6 5H8v-2h6v2zm4-8H8v-2h10v2z" opacity="0"/><path d="M12 3C6.5 3 2 6.9 2 11.7c0 2.7 1.4 5.1 3.7 6.6L5 21l3.2-1.5c1.2.3 2.5.5 3.8.5 5.5 0 10-3.9 10-8.7S17.5 3 12 3z"/></svg>';

    var panel = document.createElement("div");
    panel.className = "msl-chat-panel";
    panel.hidden = true;
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "Sound Lab Assistant chat");

    var header = document.createElement("div");
    header.className = "msl-chat-header";
    header.innerHTML = '<div class="msl-chat-avatar" aria-hidden="true">M</div>' +
      '<div><div class="msl-chat-title"></div><div class="msl-chat-subtitle"></div></div>' +
      '<div class="msl-chat-spacer"></div>';
    var langBtn = document.createElement("button");
    langBtn.className = "msl-chat-lang";
    langBtn.type = "button";
    var closeBtn = document.createElement("button");
    closeBtn.className = "msl-chat-close";
    closeBtn.type = "button";
    closeBtn.textContent = "\u2715";
    header.appendChild(langBtn);
    header.appendChild(closeBtn);

    var messages = document.createElement("div");
    messages.className = "msl-chat-messages";
    messages.setAttribute("aria-live", "polite");

    var chips = document.createElement("div");
    chips.className = "msl-chat-chips";

    var inputRow = document.createElement("div");
    inputRow.className = "msl-chat-input-row";
    var input = document.createElement("input");
    input.className = "msl-chat-input";
    input.type = "text";
    input.setAttribute("autocomplete", "off");
    var sendBtn = document.createElement("button");
    sendBtn.className = "msl-chat-send";
    sendBtn.type = "button";
    inputRow.appendChild(input);
    inputRow.appendChild(sendBtn);

    panel.appendChild(header);
    panel.appendChild(messages);
    panel.appendChild(chips);
    panel.appendChild(inputRow);
    document.body.appendChild(launcher);
    document.body.appendChild(panel);

    var lang = "en";
    var greeted = false;

    function applyLang() {
      var ui = UI[lang];
      panel.querySelector(".msl-chat-title").textContent = ui.title;
      panel.querySelector(".msl-chat-subtitle").textContent = ui.subtitle;
      input.placeholder = ui.placeholder;
      sendBtn.textContent = ui.send;
      langBtn.textContent = ui.langBtn;
      closeBtn.setAttribute("aria-label", ui.close);
      launcher.setAttribute("aria-label", ui.open);
      renderChips();
    }

    function renderChips() {
      chips.innerHTML = "";
      CHIPS[lang].forEach(function (label) {
        var b = document.createElement("button");
        b.className = "msl-chat-chip";
        b.type = "button";
        b.textContent = label;
        b.addEventListener("click", function () { handleUser(label); });
        chips.appendChild(b);
      });
    }

    function addMsg(text, who, action) {
      var div = document.createElement("div");
      div.className = "msl-chat-msg msl-chat-msg-" + who;
      if (who === "user") {
        div.textContent = text;
      } else {
        var p = document.createElement("p");
        p.textContent = text;
        div.appendChild(p);
        if (action) {
          var a = document.createElement("a");
          a.className = "msl-chat-action";
          a.href = action.href;
          a.target = "_blank";
          a.rel = "noopener";
          a.textContent = action.label;
          div.appendChild(a);
        }
      }
      messages.appendChild(div);
      messages.scrollTop = messages.scrollHeight;
      return div;
    }

    function botReply(userText) {
      var typing = document.createElement("div");
      typing.className = "msl-chat-msg msl-chat-msg-bot msl-chat-typing";
      typing.textContent = "\u2026";
      messages.appendChild(typing);
      messages.scrollTop = messages.scrollHeight;
      setTimeout(function () {
        if (typing.parentNode) typing.parentNode.removeChild(typing);
        var topic = findAnswer(userText);
        if (topic) {
          addMsg(topic[lang], "bot", topic.action ? { label: topic.action[lang], href: topic.action.href } : null);
        } else {
          addMsg(FALLBACK[lang], "bot", null);
        }
      }, 600);
    }

    function handleUser(text) {
      var clean = (text || "").trim();
      if (!clean) return;
      if (BENGALI_RE.test(clean)) lang = "bn"; else if (/^[a-z]/i.test(clean) && lang === "bn" && !BENGALI_RE.test(clean)) lang = "en";
      applyLang();
      addMsg(clean, "user", null);
      input.value = "";
      botReply(clean);
      input.focus();
    }

    function openPanel() {
      panel.hidden = false;
      launcher.innerHTML = "\u2715";
      launcher.setAttribute("aria-label", UI[lang].close);
      if (!greeted) {
        greeted = true;
        addMsg(KB[0][lang], "bot", null);
      }
      input.focus();
    }
    function closePanel() {
      panel.hidden = true;
      launcher.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 3C6.5 3 2 6.9 2 11.7c0 2.7 1.4 5.1 3.7 6.6L5 21l3.2-1.5c1.2.3 2.5.5 3.8.5 5.5 0 10-3.9 10-8.7S17.5 3 12 3z"/></svg>';
      launcher.setAttribute("aria-label", UI[lang].open);
      launcher.focus();
    }

    launcher.addEventListener("click", function () { panel.hidden ? openPanel() : closePanel(); });
    closeBtn.addEventListener("click", closePanel);
    langBtn.addEventListener("click", function () { lang = lang === "en" ? "bn" : "en"; applyLang(); });
    sendBtn.addEventListener("click", function () { handleUser(input.value); });
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") handleUser(input.value); });
    panel.addEventListener("keydown", function (e) { if (e.key === "Escape") closePanel(); });

    applyLang();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", build);
  } else {
    build();
  }
})();
