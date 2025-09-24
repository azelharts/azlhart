import BookingFlowCard from "@/components/BookingFlowCard";

const BookingFlow = [
  {
    number: 1,
    title: "Get in touch",
    icon: "/images/icons/fingerprint-shadow.svg",
  },
  {
    number: 2,
    title: "Book a call",
    icon: "/images/icons/phone-shadow.svg",
  },
  {
    number: 3,
    title: "Brief us",
    icon: "/images/icons/notebook-shadow.svg",
  },
  {
    number: 4,
    title: "Work Delivery",
    icon: "/images/icons/code-shadow.svg",
  },
];

const BookingFlowSection = () => {
  return (
    <section className="h-fit hidden flex-col sub-sections">
      <div className="max-w-container relative h-full p-container w-full mx-auto">
        <div className="custom-grid gap-y-8">
          {/* Header */}
          <div className="flex flex-col desktop:flex-row desktop:justify-between desktop:items-end font-[DrukWide] col-span-full gap-y-8 mb-16">
            <h2 className="section-sub-heading self-start desktop:self-auto desktop:max-w-[75%]">
              Your Journey Starts Here.
            </h2>
            <p className="text-sm font-[BricolageGrotesque] max-w-[75%] desktop:hidden">
              Get a free estimate and tailored ideas for your website.
            </p>
            <span className="section-quote self-end desktop:self-auto">
              &quot;BOOKING FLOW&quot;
            </span>
          </div>

          <p className="text-sm tablet:text-base desktop:text-lg font-[BricolageGrotesque] col-span-3 hidden desktop:block">
            Get a free estimate and tailored ideas for your website.
          </p>

          <div className="flex flex-col col-span-full tablet:grid tablet:grid-cols-2 tablet:gap-x-6 gap-y-6 desktop:col-start-5 col-end-12">
            {BookingFlow.map((flow) => (
              <BookingFlowCard
                key={flow.title}
                number={flow.number}
                title={flow.title}
                icon={flow.icon}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingFlowSection;
