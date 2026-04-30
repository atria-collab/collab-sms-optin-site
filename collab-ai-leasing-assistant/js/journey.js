/**
 * COLLAB AI LEASING ASSISTANT — 12-Stage Journey Interactive Demo
 * Each stage has: title, painPoint, howAIHelps, actions, value, and WhatsApp chat messages
 */

const JOURNEY_STAGES = [
  {
    id: 1,
    title: "Need Analysis",
    emoji: "🎯",
    painPoint: "Renters waste hours browsing thousands of listings that don't match their needs, budget, or situation — especially international renters who don't know where to start.",
    howHelps: "Collab AI builds a comprehensive renter profile through natural conversation — including budget, location, lifestyle, timeline, immigration and credit situation. Every recommendation is personalized to this profile.",
    actions: [
      "Build personalized renter profile",
      "Assess budget and location preferences",
      "Understand lifestyle and timeline needs",
      "Evaluate immigration and credit situation"
    ],
    value: "100% personalized recommendations from day one. Your profile is private and never shared or sold.",
    chat: [
      { from: "ai", text: "Hey! 👋 I'm your Collab AI Leasing Assistant. Let's find your perfect rental. What city are you looking in?" },
      { from: "user", text: "San Francisco Bay Area, looking to move in July" },
      { from: "ai", text: "Great choice! 🌉 What's your monthly budget range? And will you be living alone or with roommates?" },
      { from: "user", text: "Around $2,500/month, open to roommates" },
      { from: "ai", text: "Got it! A few more questions:\n\n1. Any preferred neighborhoods?\n2. Do you need parking?\n3. Pet-friendly?\n4. Are you a US citizen or international renter?\n\nThis helps me find listings that actually match your life 🎯" },
      { from: "user", text: "SOMA or Mission. No car. No pets. I'm an international student from China." },
      { from: "ai", text: "✅ Profile created!\n\n📋 Your Renter Profile:\n• Budget: $2,500/mo\n• Area: SOMA, Mission\n• Move-in: July 2025\n• Roommate: Open\n• International: Yes (student visa)\n• Parking: No\n• Pets: No\n\nI'll tailor everything to your situation — including ITIN and international renter guidance. Let's start! 🚀" }
    ]
  },
  {
    id: 2,
    title: "Roommate Matching",
    emoji: "👥",
    painPoint: "Finding compatible roommates is stressful and risky. Craigslist posts, random Facebook groups — no structured way to find someone who matches your lifestyle.",
    howHelps: "Collab AI facilitates AI-powered roommate matching entirely within WhatsApp. It collects lifestyle preferences, daily schedule, cleanliness standards, and budget — then generates compatibility scores with secure mutual opt-in introductions.",
    actions: [
      "Collect lifestyle & schedule preferences",
      "Match against renters in same area/budget",
      "Generate compatibility scores",
      "Facilitate secure introductions (mutual opt-in)"
    ],
    value: "Matched renters proceed with a combined profile and shared budget — improving approval odds and reducing per-person costs.",
    chat: [
      { from: "ai", text: "Since you're open to roommates, let me find you a compatible match! 👥\n\nQuick questions:\n1. Morning person or night owl?\n2. Cleanliness level 1-5?\n3. OK with guests frequently?\n4. Study-at-home or go out?" },
      { from: "user", text: "Night owl, 4/5 clean, guests OK on weekends, mostly study at home" },
      { from: "ai", text: "Found 3 potential matches in your area! 🎯\n\n1. 👤 Alex M. — 92% match\n   SOMA, $1,300 budget, grad student, night owl, 4/5 clean\n\n2. 👤 Sarah L. — 87% match\n   Mission, $1,200 budget, tech worker, flexible schedule\n\n3. 👤 Wei Z. — 85% match\n   SOMA, $1,400 budget, international student, Mandarin speaker\n\nWant to connect with any of them? (No personal info shared without mutual consent)" },
      { from: "user", text: "Alex and Wei look great! Let's connect" },
      { from: "ai", text: "✅ Intro requests sent! Both Alex and Wei will get a notification. Once they opt in, I'll create a group intro.\n\nYour combined budget could be $3,800-3,900/mo — which opens up much better 2BR options in SOMA! 🏠" }
    ]
  },
  {
    id: 3,
    title: "Rental Searching",
    emoji: "🔍",
    painPoint: "Renters spend 40+ hours navigating fragmented platforms. Fake listings cost US renters an estimated $5.2B annually. No unified way to compare and track options.",
    howHelps: "Collab AI aggregates listings from all major platforms, filters by your profile, flags potential scams through reverse image search and price anomaly detection, and ranks each listing by fit score.",
    actions: [
      "Aggregate listings from all platforms",
      "Filter based on renter profile",
      "Flag potential scam listings",
      "Rank by personalized fit score",
      "Send daily digest in WhatsApp"
    ],
    value: "See only listings that match your needs. Scams flagged before you waste time. Daily digest keeps you current without endless scrolling.",
    chat: [
      { from: "ai", text: "Good morning! 🌅 Here are your top 3 listings today:\n\n🏠 1. 2BR SOMA — $3,800/mo — Fit: 95%\n✅ In-unit laundry, no pet restrictions\n🔗 View listing\n\n🏠 2. 2BR Mission — $3,600/mo — Fit: 88%\n✅ Near BART, rooftop access\n🔗 View listing\n\n🚩 3. 2BR SOMA — $2,400/mo — Fit: 72%\n⚠️ SCAM ALERT: Price 40% below market. Reverse image match found on different listing.\n\nReact to tell me what you think! 👍 😐 👎" },
      { from: "user", text: "👍 Love the first one! 😐 Maybe on #2. Thanks for catching that scam!" },
      { from: "ai", text: "Great taste! 🎯 I'll find more like listing #1 tomorrow.\n\nAbout that scam — the photos matched a listing in LA posted by a different person, and the price was suspiciously low. I've flagged it on the platform too.\n\nWant me to start outreach to the landlord for listing #1? 📧" }
    ]
  },
  {
    id: 4,
    title: "Reaching Out",
    emoji: "📧",
    painPoint: "Crafting personalized outreach messages for every listing is time-consuming. Following up when there's no response is tedious. Many opportunities are lost.",
    howHelps: "Collab AI drafts personalized outreach messages for each listing. Messages are sent only after your explicit approval. The AI follows up automatically if there's no response within 48 hours.",
    actions: [
      "Draft personalized outreach messages",
      "Send only with your explicit approval",
      "Auto follow-up after 48 hours",
      "Pre-qualify landlord requirements"
    ],
    value: "Never miss an opportunity. Professional outreach without the effort. You only engage when there's a real prospect.",
    chat: [
      { from: "ai", text: "I've drafted an outreach message for the SOMA 2BR listing:\n\n📝 Draft:\n\"Hi, I'm interested in the 2BR at [address]. I'm a grad student relocating to SF in July with a roommate. Our combined budget is $3,800/mo. We're clean, quiet, and responsible tenants. Would love to schedule a viewing. Available weekdays after 3pm.\"\n\nShall I send this, or would you like to edit it?" },
      { from: "user", text: "Looks great, send it!" },
      { from: "ai", text: "✅ Sent! I'll let you know when they respond.\n\nIf no reply in 48 hours, I'll send a polite follow-up automatically. You can relax — I've got this! 📬" },
      { from: "ai", text: "🔔 Update: The landlord replied! They confirmed the unit is available and suggested Tuesday or Thursday for a viewing. Want me to check your calendar and suggest times? 📅" }
    ]
  },
  {
    id: 5,
    title: "Touring & Booking",
    emoji: "🗓️",
    painPoint: "Scheduling viewings across multiple listings is chaotic. Renters often miss red flags during tours. Remote renters can't visit in person.",
    howHelps: "Collab AI syncs with your calendar to suggest available time slots and book tours automatically. It provides pre-tour briefings, red flags to look for, and post-tour comparison across visits.",
    actions: [
      "Sync with your calendar",
      "Schedule tour appointments",
      "Pre-tour briefing & checklist",
      "Post-tour comparison",
      "Virtual tour coordination for remote renters"
    ],
    value: "Never double-book. Go into every tour prepared. Compare properties objectively after visits.",
    chat: [
      { from: "ai", text: "📅 Tour booked!\n\n🏠 2BR SOMA — Tuesday 3:30 PM\n📍 123 Folsom St, Unit 4B\n\nHere's your pre-tour checklist:\n✅ Check water pressure in kitchen & bath\n✅ Look for signs of mold (corners, windowsills)\n✅ Test all windows and locks\n✅ Ask about laundry schedule\n✅ Check cell reception\n✅ Ask about lease flexibility\n\n🚩 Red flags to watch:\n• Landlord avoids showing certain rooms\n• Pressure to sign immediately\n• No formal lease offered\n\nI'll ask you for a quick review after the tour! 🏡" },
      { from: "user", text: "Just finished the tour! Unit was nice but the kitchen was small" },
      { from: "ai", text: "Thanks for the update! 📝\n\n📊 Your Tour Comparison:\n\n| | SOMA 2BR | Mission 2BR (pending) |\n|---|---|---|\n| Price | $3,800 | $3,600 |\n| Kitchen | Small ⚠️ | TBD |\n| Laundry | In-unit ✅ | TBD |\n| Location | 9/10 | TBD |\n| Overall | 7/10 | — |\n\nLet's tour the Mission listing next to compare! 🗓️" }
    ]
  },
  {
    id: 6,
    title: "Leasing Application",
    emoji: "📋",
    painPoint: "Every property has different application requirements. International renters face extra barriers — ITIN, overseas income, no US credit history. Tracking multiple applications is a mess.",
    howHelps: "Collab AI provides application checklists based on property type, helps prepare documents, drafts renter cover letters, and tracks multiple applications. Special guidance for international renters.",
    actions: [
      "Property-specific application checklists",
      "Document preparation guidance",
      "Renter cover letter drafting",
      "Multi-application tracking",
      "International renter support (ITIN, guarantor)"
    ],
    value: "Submit complete, competitive applications every time. International renters get dedicated guidance.",
    chat: [
      { from: "ai", text: "Ready to apply for the SOMA 2BR! 📋\n\nHere's your application checklist:\n\n✅ Passport (ready)\n✅ Student visa / I-20 (ready)\n⚠️ ITIN — You'll need this. I can guide you through the application process.\n⚠️ Proof of funds — Bank statement or scholarship letter\n⚠️ Guarantor — Some landlords require this for international students\n\nI can also draft a renter cover letter to strengthen your application. Want me to?" },
      { from: "user", text: "Yes please! And I'm not sure about the guarantor part" },
      { from: "ai", text: "No worries! Here are your guarantor options:\n\n1. 🏛️ Institutional guarantor (like Insurent or TheGuarantors) — no US co-signer needed\n2. 👨‍👩‍👧 Family member with US income\n3. 💰 Pay extra months upfront (some landlords accept this)\n\nI recommend option 1 for international students. I can help you apply to Insurent right now.\n\n📝 And here's your cover letter draft — personalized, professional, and highlights your strengths as a tenant!" }
    ]
  },
  {
    id: 7,
    title: "Lease Review ⭐",
    emoji: "📄",
    featured: true,
    painPoint: "Lease agreements are long, complex legal documents full of hidden fees, auto-renewal traps, and unusual liability clauses. Most renters sign without understanding what they're agreeing to.",
    howHelps: "Upload your lease directly in WhatsApp. Collab AI translates the entire lease into plain English, flags hidden fees, identifies auto-renewal traps, provides tenant rights guidance by state, and identifies negotiable terms.",
    actions: [
      "Translate full lease to plain English",
      "Flag hidden fees and unusual charges",
      "Identify auto-renewal traps",
      "State-specific tenant rights guidance",
      "Highlight negotiable terms"
    ],
    value: "Understand every word of your lease. Never get trapped by hidden clauses. Know your rights before you sign.",
    chat: [
      { from: "user", text: "Here's my lease draft 📄 [lease_agreement.pdf]" },
      { from: "ai", text: "📄 Lease Review Complete!\n\n✅ Standard clauses — 18 of 22 terms look normal\n\n🚩 3 Issues Found:\n\n1. 🚩 Auto-renewal clause (Section 4.2)\n   → Lease auto-renews for 12 months unless you give 90-day notice. Most CA leases require only 30 days.\n\n2. 🚩 Hidden fee (Section 7.1)\n   → $150/mo \"amenity fee\" on top of rent. Not clearly disclosed in the listing.\n\n3. ⚠️ Liability clause (Section 9.3)\n   → You're liable for ALL maintenance under $500. This is negotiable.\n\n💰 Potential savings: $150/mo ($1,800/year) if you negotiate the amenity fee.\n\nWant me to draft negotiation points? 📝" },
      { from: "user", text: "Yes! This is incredible. I would have missed all of this." },
      { from: "ai", text: "That's exactly why I'm here! 💪\n\n📝 Negotiation Recommendations:\n\n1. Request removal or reduction of amenity fee — \"Can we discuss the $150 amenity fee? It wasn't mentioned in the listing.\"\n\n2. Change notice period to 30 days (CA standard)\n\n3. Raise maintenance threshold to $100 (more reasonable)\n\nI'll draft the email for you in the next step! ✉️" }
    ]
  },
  {
    id: 8,
    title: "Lease Negotiation",
    emoji: "🤝",
    painPoint: "Most renters don't know they can negotiate lease terms. They lack market knowledge and negotiation skills. Verbal agreements disappear — there's no paper trail.",
    howHelps: "Collab AI provides negotiation strategy based on market conditions, landlord type, and property specifics. It coaches you through the process and drafts counter-proposals you can send directly.",
    actions: [
      "Market-based negotiation strategy",
      "Counter-proposal drafting",
      "Negotiation coaching",
      "Paper trail guidance (all via email)"
    ],
    value: "Common wins: free first month, reduced deposit, earlier access, parking included. Everything documented.",
    chat: [
      { from: "ai", text: "Let's negotiate! Based on current SF market conditions:\n\n📊 Market Analysis:\n• SOMA vacancy rate: 6.2% (landlord's market is weakening)\n• Comparable 2BRs: $3,500-3,900\n• Listing has been up 21 days (leverage!)\n\n💡 My recommended strategy:\n1. Lead with the amenity fee removal (strongest point)\n2. Then request 30-day notice period\n3. Ask for free parking as a sweetener\n\nHere's a draft email:" },
      { from: "user", text: "Send it!" },
      { from: "ai", text: "📧 Email drafted:\n\n\"Dear [Landlord],\n\nThank you for the lease draft. We're very interested and would like to discuss a few terms:\n\n1. The $150/mo amenity fee was not disclosed in the listing — could we discuss removing or reducing this?\n2. Could the notice period be adjusted to 30 days, consistent with CA standard?\n3. Would parking be available at no additional cost?\n\nWe're ready to sign once these points are addressed. Thank you!\"\n\n✅ Sent via email (paper trail preserved). I'll track the response! 📬" }
    ]
  },
  {
    id: 9,
    title: "Lease Signing",
    emoji: "✍️",
    painPoint: "After negotiation, renters need to verify all agreed terms are actually in the final documents. Important dates and deadlines get lost after signing.",
    howHelps: "Collab AI guides you through the e-signature process, verifies all negotiated terms are reflected in the final lease, and creates a comprehensive summary card with key dates and reminders.",
    actions: [
      "E-signature process guidance",
      "Verify negotiated terms in final lease",
      "Create lease summary card",
      "Set up calendar reminders"
    ],
    value: "Never miss a rent payment, renewal notice deadline, or lease end date. Everything important in one place.",
    chat: [
      { from: "ai", text: "🎉 Landlord accepted your terms! Final lease is ready for signing.\n\nBefore you sign, I've verified:\n✅ Amenity fee removed\n✅ Notice period changed to 30 days\n✅ Free parking included\n✅ Maintenance threshold raised to $100\n\nAll negotiated changes are properly reflected. You're good to sign! ✍️" },
      { from: "user", text: "Just signed! 🎉" },
      { from: "ai", text: "Congratulations! 🏡🎊\n\n📋 Your Lease Summary Card:\n\n📍 123 Folsom St, Unit 4B, SF\n💰 Rent: $3,800/mo (no amenity fee!)\n📅 Lease: July 1 - June 30, 2026\n🔔 Renewal notice by: May 31, 2026\n💳 Rent due: 1st of each month\n🅿️ Parking: Included\n👤 Landlord: Bay Property Mgmt\n📧 Contact: manager@bayprop.com\n\nI've set calendar reminders for:\n⏰ Rent due (monthly)\n⏰ Renewal notice deadline\n⏰ Lease end date" }
    ]
  },
  {
    id: 10,
    title: "Move-in Payment",
    emoji: "💳",
    painPoint: "Move-in costs add up fast — first month, last month, security deposit, fees. Wire transfer scams are rampant. International renters face additional complications with currency and bank coordination.",
    howHelps: "Collab AI provides a full upfront cost breakdown, verifies payment instructions against known scam patterns, and provides guidance on acceptable payment methods and receipt documentation.",
    actions: [
      "Full upfront cost breakdown",
      "Verify payment instructions (anti-scam)",
      "Acceptable payment methods guidance",
      "Receipt documentation",
      "Wire fee & currency guidance for international renters"
    ],
    value: "Know exactly what you owe before move-in. Never fall for a wire transfer scam. Every payment documented.",
    chat: [
      { from: "ai", text: "💳 Move-in Payment Summary:\n\n📋 Due before July 1:\n• First month rent: $3,800\n• Security deposit: $3,800\n• Key deposit: $50\n• Total: $7,650\n\n⚠️ Payment Safety Checklist:\n✅ Pay by certified check or bank transfer ONLY\n✅ Get a signed receipt for every payment\n✅ NEVER wire money to a personal account\n✅ Verify the bank account matches the management company\n\nThe landlord's payment instructions have been verified against our records. ✅" },
      { from: "user", text: "I'm transferring from a Chinese bank account. Any tips?" },
      { from: "ai", text: "Great question! 🌏 For international transfers:\n\n1. 💱 Use Wise (TransferWise) — lower fees than bank wire\n2. ⏰ Start 5-7 days before due date (transfers take time)\n3. 🏦 Your Chinese bank may require proof of purpose — I can help draft the letter\n4. 📝 Save all transfer receipts and confirmation numbers\n5. 💡 Current USD/CNY rate: ~7.24\n   Total in CNY: ~¥55,400\n\nWant me to create a step-by-step payment timeline? 📅" }
    ]
  },
  {
    id: 11,
    title: "Move-in Checklist",
    emoji: "✅",
    painPoint: "There's so much to do before and during move-in — keys, utilities, insurance, inspections, address changes. Things slip through the cracks.",
    howHelps: "Collab AI delivers an interactive move-in checklist in WhatsApp that you complete by tapping items. Covers everything from landlord handoffs to utility setup and documentation.",
    actions: [
      "Interactive WhatsApp checklist",
      "Landlord handoff verification",
      "Utility and insurance setup",
      "Move-in photo documentation",
      "Address change guidance"
    ],
    value: "Nothing falls through the cracks. Photo documentation protects your deposit. Everything tracked in one place.",
    chat: [
      { from: "ai", text: "🏡 Move-in Day Checklist!\n\nTap ✅ as you complete each item:\n\n📦 From Landlord:\n☐ All keys received\n☐ Signed move-in condition report\n☐ Parking permit\n☐ Building rules / HOA info\n☐ Emergency contacts\n☐ Utility transfer instructions\n\n📋 Your To-Dos:\n☐ Renter's insurance active\n☐ Utilities set up (PG&E, Internet)\n☐ USPS address change\n☐ Bank address update\n☐ DMV address update (if applicable)\n☐ Move-in photos & video taken\n☐ Elevator reserved (if needed)" },
      { from: "user", text: "✅ Keys, condition report, parking permit done!" },
      { from: "ai", text: "Great progress! 3/6 landlord items done ✅\n\n📸 IMPORTANT: Take photos & video of EVERYTHING before moving furniture in:\n• All walls, floors, ceilings\n• Kitchen appliances\n• Bathroom fixtures\n• Windows and doors\n• Any existing damage\n\nThis protects your security deposit at move-out! I'll remind you to save these. 📁\n\nRemaining items:\n☐ Building rules / HOA info\n☐ Emergency contacts\n☐ Utility transfer instructions" }
    ]
  },
  {
    id: 12,
    title: "Lease Termination + Deposit",
    emoji: "💰",
    painPoint: "Renters lose billions in security deposits due to unfair deductions. Most don't know their state's deposit return laws, timelines, or dispute options.",
    howHelps: "Collab AI supports lease termination with state-specific notice requirements, move-out inspection preparation, security deposit return tracking, and dispute playbook including demand letters and small claims guidance.",
    actions: [
      "State-specific notice requirements",
      "Move-out notice drafting",
      "Inspection preparation",
      "Deposit return tracking",
      "Dispute playbook & demand letter",
      "Small claims guidance"
    ],
    value: "Maximize your deposit return. Know your rights. Get professional dispute support if needed.",
    chat: [
      { from: "ai", text: "⏰ Your lease ends June 30, 2026. Let's plan your move-out!\n\n📅 California Move-Out Timeline:\n• 30 days before: Send move-out notice\n• 2 weeks before: Schedule inspection\n• Move-out day: Final walkthrough + photos\n• After move-out: Landlord has 21 days to return deposit\n\nWant me to draft your move-out notice? 📝" },
      { from: "user", text: "Yes! And what about my deposit?" },
      { from: "ai", text: "📝 Move-out notice drafted and ready to send!\n\n💰 Deposit Return Guide (California):\n\n• Landlord must return deposit within 21 days\n• Can deduct ONLY for:\n  - Unpaid rent\n  - Damage beyond normal wear & tear\n  - Cleaning (if needed beyond normal)\n• Normal wear & tear is NOT deductible:\n  - Small nail holes ✅\n  - Faded paint ✅\n  - Worn carpet ✅\n\n🛡️ If they don't return it:\n1. I'll draft a demand letter\n2. Guide you through small claims court ($0-$10K)\n3. You may be entitled to 2x deposit as penalty\n\nI'll track the 21-day deadline and remind you! ⏰" }
    ]
  }
];

// Export for use in main.js
if (typeof window !== 'undefined') {
  window.JOURNEY_STAGES = JOURNEY_STAGES;
}
