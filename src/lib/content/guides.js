/**
 * Guide & article content, restructured from the extracted website text.
 * - Facts are preserved; wording is tightened. Nothing here adds new numbers.
 * - `partial: true` marks entries whose full body was NOT captured in the
 *   content extraction (only the retrieved summary is used). Paste the full
 *   article text from your CMS to complete them — see README "Content to finish".
 * - Slugs equal the original URL slugs; next.config.mjs redirects old URLs.
 */
export const GUIDES = [
  /* ------------------------------ Core guides ------------------------------ */
  {
    slug: "refrigerator-fit-guide",
    kind: "guide",
    appliance: "refrigerator",
    title: "Will My Refrigerator Fit? Refrigerator Fit Guide",
    summary: "Measure the actual opening — width, height and available depth — not the old refrigerator.",
    sections: [
      { h: "Check refrigerator size before you buy", p: ["Measure the actual cabinet or installation opening. Measure width, height and available depth; do not rely only on the old refrigerator’s measurements."] },
      {
        h: "How to measure for a refrigerator",
        p: ["A 36-inch refrigerator does not always fit a 36-inch opening. Clearance requirements vary by model."],
        list: ["Measure the actual opening width, height and depth", "Check door clearance and the delivery route", "Compare exact model dimensions with the manufacturer’s requirements"],
      },
    ],
    related: ["will-a-36-inch-refrigerator-fit-a-36-inch-opening", "how-much-space-should-be-between-a-refrigerator-and-the-wall", "can-a-refrigerator-stick-out-past-the-counter"],
  },
  {
    slug: "will-a-36-inch-refrigerator-fit-a-36-inch-opening",
    kind: "question",
    appliance: "refrigerator",
    title: "Will a 36-Inch Refrigerator Fit a 36-Inch Opening?",
    summary: "Not always. Measure the opening itself and use the smallest measurement.",
    sections: [
      {
        h: "Why a 36-inch refrigerator may not fit",
        p: ["Measure the actual opening, not the old refrigerator."],
        list: ["Measure width at the top, middle and bottom — use the smallest measurement", "Check height and depth", "Check walls, cabinets, countertops and doorways"],
      },
      {
        h: "How much clearance does a refrigerator need?",
        p: ["Do not assume every 36-inch refrigerator has identical dimensions. Avoid rounding measurements, and don’t forget door swing and nearby obstructions."],
      },
    ],
    related: ["refrigerator-fit-guide", "what-if-my-refrigerator-is-too-wide-for-the-opening"],
  },
  {
    slug: "what-size-wall-oven-fits-my-existing-cutout",
    kind: "question",
    appliance: "wall-oven",
    title: "What Size Wall Oven Fits My Existing Cutout?",
    summary: "Measure the real cabinet cutout in several places, then check the electrical and trim details.",
    sections: [
      {
        h: "Why wall oven cutout size matters",
        p: ["Measure the actual cabinet cutout width, height and depth. Measure width and height in multiple places and use the smallest."],
        list: ["Electrical junction box and conduit", "Trim", "Oven-door clearance"],
      },
      { h: "Can a 30-inch wall oven fit a smaller cutout?", p: ["Measuring first can prevent unexpected cabinet modifications and installation delays."] },
    ],
    related: ["wall-oven-cutout-dimensions", "what-happens-if-a-wall-oven-cutout-is-too-big", "can-i-replace-a-27-inch-wall-oven-with-a-30-inch-wall-oven"],
  },
  {
    slug: "wall-oven-cutout-dimensions",
    kind: "guide",
    appliance: "wall-oven",
    title: "Will This Wall Oven Fit My Cabinet? Wall Oven Cutout Guide",
    summary: "How to compare a wall oven with your existing cabinet cutout.",
    partial: true,
    sections: [
      {
        h: "Compare before you buy",
        p: ["Compare the cutout dimensions with the overall oven dimensions, and check cabinet support, clearances, electrical location and any possible modifications."],
      },
    ],
    related: ["what-size-wall-oven-fits-my-existing-cutout", "what-happens-if-a-wall-oven-cutout-is-too-big"],
  },
  {
    slug: "dishwasher-opening-size-guide",
    kind: "guide",
    appliance: "dishwasher",
    title: "Dishwasher Opening Size Guide",
    summary: "A 24-inch dishwasher does not fit every 24-inch opening. Here’s what to measure.",
    sections: [
      {
        h: "Will this dishwasher fit?",
        p: ["These are the most common reasons a dishwasher doesn’t fit:"],
        list: [
          "A unit that is too wide",
          "A short opening",
          "New flooring reducing the opening height",
          "Excessive depth",
          "Door interference",
          "Water, drain or electrical connection problems",
          "Tight side clearance",
          "Unsuitable countertop or mounting conditions",
        ],
      },
      {
        h: "How to measure for a dishwasher",
        p: ["A 24-inch dishwasher does not fit every 24-inch opening — required space depends on the model."],
        list: ["New flooring can reduce the opening height", "If the opening is too small, cabinetry or surrounding space may need modification", "Make sure the door opens fully"],
      },
    ],
    related: ["what-if-my-dishwasher-opening-is-less-than-24-inches"],
  },
  {
    slug: "cooktop-cutout-size-guide",
    kind: "guide",
    appliance: "cooktop",
    title: "Cooktop Cutout Size Guide",
    summary: "The same advertised size does not guarantee the same cutout.",
    sections: [
      {
        h: "Will this cooktop fit?",
        p: ["Common problems include:"],
        list: [
          "An opening that is too narrow or shallow",
          "A new cooktop too small to cover the opening",
          "Countertop modifications",
          "Backsplash interference",
          "Downdraft parts not fitting below",
          "Gas or electrical connection issues",
        ],
      },
      {
        h: "How to measure for a cooktop",
        p: ["The same advertised size does not guarantee the same cutout. Granite or quartz modification may be possible but should be done by a qualified professional."],
        list: ["Check trim coverage if the new cooktop is smaller", "Downdraft models need under-counter space"],
      },
    ],
    related: ["can-a-cooktop-cutout-be-enlarged", "can-i-replace-a-30-inch-cooktop-with-a-36-inch-cooktop", "can-i-replace-an-electric-cooktop-with-an-induction-cooktop"],
  },
  {
    slug: "over-the-range-microwave-fit-guide",
    kind: "guide",
    appliance: "otr-microwave",
    title: "Over-the-Range Microwave Fit Guide",
    summary: "Same width does not guarantee fit — check mounting, venting and cabinet depth too.",
    sections: [
      {
        h: "Will this over-the-range microwave fit?",
        p: ["Common problems include:"],
        list: [
          "A microwave that is too wide",
          "Upper-cabinet depth",
          "Insufficient cooking-surface clearance",
          "A mismatched mounting bracket",
          "Backsplash or wall issues",
          "Vent mismatch",
          "Outlet interference",
          "Inadequate mounting support",
        ],
      },
      {
        h: "How to measure",
        p: ["Same width does not guarantee fit."],
        list: ["Use the supplied mounting bracket where specified", "Check venting: upward, through the rear wall, or recirculating", "Compare all exact manufacturer requirements"],
      },
    ],
    related: ["will-an-over-the-range-microwave-fit-in-my-existing-space", "can-i-replace-a-built-in-microwave-with-an-over-the-range-microwave"],
  },
  {
    slug: "range-hood-fit-guide",
    kind: "guide",
    appliance: "range-hood",
    title: "Range Hood Fit Guide",
    summary: "Will this range hood fit? Check range hood size before you buy.",
    partial: true,
    sections: [
      {
        h: "Will this range hood fit?",
        p: ["Check range hood size before you buy. A good fit check covers the hood’s dimensions, the mounting space, duct and vent location, the electrical connection, surrounding cabinets and the manufacturer’s clearances."],
      },
    ],
    related: ["can-i-replace-a-30-inch-range-hood-with-a-36-inch-range-hood", "can-i-replace-an-over-the-range-microwave-with-a-range-hood"],
  },

  /* --------------------------- Questions & answers -------------------------- */
  {
    slug: "can-a-cooktop-cutout-be-enlarged",
    kind: "question",
    appliance: "cooktop",
    title: "Can a Cooktop Cutout Be Enlarged?",
    summary: "There is no universal safe amount — follow the appliance’s own installation limits.",
    sections: [
      { h: "When can a cooktop cutout be enlarged?", p: ["There is no universal safe amount. Follow the exact appliance installation limits and make sure sufficient material remains around the cutout."] },
      {
        h: "What if the new cutout is smaller?",
        p: ["Compare:"],
        list: ["Existing cutout width and depth", "New cooktop overall width and depth", "Required clearances", "Space below", "Locations of drawers, cabinets, electrical connections and gas lines"],
      },
    ],
    related: ["cooktop-cutout-size-guide"],
  },
  {
    slug: "can-a-refrigerator-stick-out-past-the-counter",
    kind: "question",
    appliance: "refrigerator",
    title: "Can a Refrigerator Stick Out Past the Counter?",
    summary: "Counter-depth does not always mean flush — doors, handles and hinges project forward.",
    sections: [
      {
        h: "How far should it stick out?",
        p: ["Counter-depth does not always mean flush: doors, handles and hinges may project forward. Compare depth with the doors and handles installed and open, the cabinet depth, and nearby walls."],
      },
      {
        h: "What if it sticks out too far?",
        p: ["Review:"],
        list: ["Opening width, height and depth", "Countertop and cabinet depth", "Nearby walls", "Door-swing clearance", "Rear water and electrical connections", "The delivery path"],
      },
    ],
    related: ["will-a-counter-depth-refrigerator-fit-in-a-standard-refrigerator-opening", "refrigerator-fit-guide"],
  },
  {
    slug: "how-much-space-should-be-between-a-refrigerator-and-the-wall",
    kind: "question",
    appliance: "refrigerator",
    title: "How Much Space Should Be Between a Refrigerator and the Wall?",
    summary: "It depends on the model and its hinge and door design — use the manufacturer’s requirements.",
    sections: [
      {
        h: "Why side clearance matters",
        p: ["The exact distance depends on the model and its hinge and door design."],
        list: ["Side clearance", "Door swing and handle", "Drawer removal", "Nearby countertop or cabinet interference"],
      },
      { h: "Possible solutions", p: ["Clearance may be needed on the sides, above and behind. Use the manufacturer’s requirements rather than a generic number."] },
    ],
    related: ["refrigerator-fit-guide"],
  },
  {
    slug: "what-happens-if-a-wall-oven-cutout-is-too-big",
    kind: "question",
    appliance: "wall-oven",
    title: "What Happens If a Wall Oven Cutout Is Too Big?",
    summary: "Often it can still work with secure framing, filler or cabinet support — confirm the details first.",
    sections: [
      {
        h: "How much bigger can a cutout be?",
        p: ["Often it can work with properly secured framing, filler material or cabinet support. Confirm the exact cutout dimensions, depth, support and clearances first."],
      },
      {
        h: "What if there is a gap?",
        p: ["Measure the opening width, height and usable depth, plus the support surface, any obstructions and the electrical connection. Measure in multiple places because older cabinets may not be square."],
      },
      {
        h: "Common problems",
        p: ["Compare the cutout dimensions, overall oven dimensions, cabinet support, clearances, electrical location and possible modifications."],
      },
    ],
    related: ["what-size-wall-oven-fits-my-existing-cutout", "wall-oven-cutout-dimensions"],
  },
  {
    slug: "can-i-replace-a-27-inch-wall-oven-with-a-30-inch-wall-oven",
    kind: "question",
    appliance: "wall-oven",
    title: "Can I Replace a 27-Inch Wall Oven With a 30-Inch Wall Oven?",
    summary: "A 30-inch oven typically needs a wider opening. The exact difference is model-specific.",
    partial: true,
    sections: [
      {
        h: "What to compare",
        p: ["A 30-inch wall oven typically needs a wider cabinet opening than a 27-inch model. The exact difference is model-specific, so compare:"],
        list: ["Exact cutout width, height and depth", "Support base and cabinet structure", "Electrical connection", "Material available for modification"],
      },
    ],
    related: ["what-size-wall-oven-fits-my-existing-cutout"],
  },
  {
    slug: "can-i-replace-a-30-inch-range-hood-with-a-36-inch-range-hood",
    kind: "question",
    appliance: "range-hood",
    title: "Can I Replace a 30 Inch Range Hood With a 36 Inch Range Hood?",
    summary: "A 36-inch hood may replace a 30-inch hood if the available space and venting allow it.",
    partial: true,
    sections: [
      {
        h: "What to compare",
        p: ["A 36-inch hood may replace a 30-inch hood if the available cabinet and wall space and the venting allow it. Compare:"],
        list: ["Hood depth", "Mounting height", "Duct location", "Electrical connection", "Cabinets", "Manufacturer clearances"],
      },
    ],
    related: ["range-hood-fit-guide"],
  },
  {
    slug: "can-i-replace-a-30-inch-cooktop-with-a-36-inch-cooktop",
    kind: "question",
    appliance: "cooktop",
    title: "Can I Replace a 30-Inch Cooktop With a 36-Inch Cooktop?",
    summary: "It depends on the cutout, countertop material, space below and connections.",
    partial: true,
    sections: [
      {
        h: "What decides it",
        p: ["Whether the larger cooktop works depends on whether these support it:"],
        list: ["The countertop cutout", "Available countertop material", "Under-counter space", "Gas and electrical connections", "Clearances"],
      },
    ],
    related: ["can-a-cooktop-cutout-be-enlarged", "cooktop-cutout-size-guide"],
  },
  {
    slug: "can-i-replace-a-built-in-microwave-with-a-different-brand",
    kind: "question",
    appliance: "wall-oven-microwave-combo",
    title: "Can I Replace a Built-In Microwave With a Different Brand?",
    summary: "Don’t assume an existing trim kit works with another brand or model.",
    partial: true,
    sections: [
      {
        h: "What to check",
        p: ["Compare exact dimensions, the cutout, trim-kit compatibility, ventilation and outlet location. Do not assume an existing trim kit works with another brand or model, and note that outlet position can reduce the usable cabinet depth."],
      },
    ],
    related: ["can-i-replace-a-built-in-microwave-with-an-over-the-range-microwave"],
  },
  {
    slug: "can-i-replace-a-built-in-microwave-with-an-over-the-range-microwave",
    kind: "question",
    appliance: "otr-microwave",
    title: "Can I Replace a Built-In Microwave With an Over-the-Range Microwave?",
    summary: "Installation styles differ — an existing built-in opening is not automatically suitable.",
    partial: true,
    sections: [
      {
        h: "What to check",
        p: ["Installation styles differ. Check the space above the cooking surface, cabinet configuration, mounting area, electrical connection, ventilation and the exact installation requirements. The existing built-in opening is not automatically suitable."],
      },
    ],
    related: ["over-the-range-microwave-fit-guide"],
  },
  {
    slug: "can-i-replace-a-double-wall-oven-with-a-microwave-oven-combo",
    kind: "question",
    appliance: "wall-oven-microwave-combo",
    title: "Can I Replace a Double Wall Oven With a Microwave Oven Combo?",
    summary: "Compare cutout dimensions, electrical needs, cabinet support, trim and clearances.",
    partial: true,
    sections: [
      {
        h: "What to compare",
        p: ["Replacing a double wall oven with a microwave-oven combination involves comparing:"],
        list: ["Cabinet cutout dimensions", "Electrical requirements", "Cabinet support", "Trim", "Manufacturer clearances"],
      },
    ],
    related: ["wall-oven-cutout-dimensions"],
  },
  {
    slug: "can-i-replace-a-gas-range-with-an-electric-range",
    kind: "question",
    appliance: null,
    title: "Can I Replace a Gas Range With an Electric Range?",
    summary: "Physical fit is not enough — electrical and gas-line requirements matter too.",
    partial: true,
    sections: [
      {
        h: "Beyond the dimensions",
        p: ["Physical fit is not sufficient. Check:"],
        list: ["Electrical circuit and receptacle requirements", "Safe gas-line handling", "Appliance dimensions", "Manufacturer instructions"],
      },
    ],
    related: ["can-i-replace-a-slide-in-range-with-a-freestanding-range"],
  },
  {
    slug: "can-i-replace-a-slide-in-range-with-a-freestanding-range",
    kind: "question",
    appliance: null,
    title: "Can I Replace a Slide-In Range With a Freestanding Range?",
    summary: "Width, depth, side gaps, countertop overlap, backsplash and anti-tip all come into play.",
    partial: true,
    sections: [
      {
        h: "What to compare",
        p: ["This swap involves:"],
        list: ["Width and depth", "Side gaps", "Countertop overlap", "Backsplash and control-panel design", "Anti-tip installation", "Utility connections"],
      },
    ],
    related: ["can-i-replace-a-gas-range-with-an-electric-range"],
  },
  {
    slug: "can-i-replace-an-electric-cooktop-with-an-induction-cooktop",
    kind: "question",
    appliance: "cooktop",
    title: "Can I Replace an Electric Cooktop With an Induction Cooktop?",
    summary: "Check the cutout, countertop coverage, electrical supply and under-counter clearance.",
    partial: true,
    sections: [
      {
        h: "What to consider",
        p: ["Relevant considerations include the cutout dimensions, countertop coverage, electrical supply, under-counter clearance and the installation requirements."],
      },
    ],
    related: ["cooktop-cutout-size-guide"],
  },
  {
    slug: "can-i-replace-an-over-the-range-microwave-with-a-range-hood",
    kind: "question",
    appliance: "range-hood",
    title: "Can I Replace an Over-the-Range Microwave With a Range Hood?",
    summary: "The microwave’s existing vent and opening may not match a hood.",
    partial: true,
    sections: [
      {
        h: "What to check",
        p: ["Check hood width and depth, mounting height, duct configuration, electrical connection and clearances. The existing microwave vent and opening may not match."],
      },
    ],
    related: ["range-hood-fit-guide"],
  },
  {
    slug: "what-if-my-dishwasher-opening-is-less-than-24-inches",
    kind: "question",
    appliance: "dishwasher",
    title: "What If My Dishwasher Opening Is Less Than 24 Inches?",
    summary: "A standard full-size dishwasher may not fit without modification.",
    partial: true,
    sections: [
      {
        h: "Your options",
        p: ["A standard full-size dishwasher may not fit an opening under 24 inches without modification. Measure width, height and depth, and compare the exact model. Possible options:"],
        list: ["Safe cabinet modification", "A compact dishwasher", "A different model"],
      },
      { h: "Watch the height", p: ["New flooring may reduce the opening height."] },
    ],
    related: ["dishwasher-opening-size-guide"],
  },
  {
    slug: "what-if-my-refrigerator-is-too-wide-for-the-opening",
    kind: "question",
    appliance: "refrigerator",
    title: "What If My Refrigerator Is Too Wide for the Opening?",
    summary: "Do not force it. Re-measure in several places and look for hidden obstructions.",
    partial: true,
    sections: [
      {
        h: "Don’t force it",
        p: ["Do not force the refrigerator. Measure the opening at multiple locations and compare the exact width and clearances. Possible obstructions include:"],
        list: ["Trim", "Countertop overhang", "Baseboard", "Uneven walls", "Non-square cabinets", "Flooring or molding"],
      },
    ],
    related: ["will-a-36-inch-refrigerator-fit-a-36-inch-opening"],
  },
  {
    slug: "will-a-counter-depth-refrigerator-fit-in-a-standard-refrigerator-opening",
    kind: "question",
    appliance: "refrigerator",
    title: "Will a Counter Depth Refrigerator Fit in a Standard Refrigerator Opening?",
    summary: "Counter-depth does not guarantee a flush fit.",
    partial: true,
    sections: [
      {
        h: "What to compare",
        p: ["Compare width, height, body depth, door and handle depth, hinge and door swing, ventilation and connections. Counter-depth does not guarantee a flush fit."],
      },
    ],
    related: ["can-a-refrigerator-stick-out-past-the-counter"],
  },
  {
    slug: "will-an-over-the-range-microwave-fit-in-my-existing-space",
    kind: "question",
    appliance: "otr-microwave",
    title: "Will an Over-the-Range Microwave Fit in My Existing Space?",
    summary: "Check more than width: mounting height, depth, venting and electrical connection.",
    partial: true,
    sections: [
      {
        h: "What to measure",
        p: ["Fit depends on cabinet width, mounting height, depth, venting and electrical connection. Measure:"],
        list: ["The opening at the top, middle and bottom", "Height above the cooking surface", "Cabinet depth", "Outlet, vent and mounting area"],
      },
    ],
    related: ["over-the-range-microwave-fit-guide"],
  },
];

export const getGuide = (slug) => GUIDES.find((g) => g.slug === slug);
