import FadeInWhenVisible from "../animations/FadeInWhenVisible";

interface ISoftwareBenefitsProps {
  title: string;
  description: string;
  className?: string;
}

const TitleDesc = ({
  title,
  description,
  className,
}: ISoftwareBenefitsProps) => {
  return (
    <div className={`px-4 ${className}`}>
      {/* Header Section */}
      <div className="px-4">
        <FadeInWhenVisible>
          <h2 className="text-xl sm:text-xl md:text-2xl font-bold mb-3 uppercase" style={{color: "var(--title-color)"}}>
            {title}
          </h2>
        </FadeInWhenVisible>
        <FadeInWhenVisible delay={0.2}>
          <p className="text-sm sm:text-base md:text-sm" style={{color: "var(--desc-color)"}}>
            {description}
          </p>
        </FadeInWhenVisible>
      </div>
    </div>
  );
};

export default TitleDesc;
