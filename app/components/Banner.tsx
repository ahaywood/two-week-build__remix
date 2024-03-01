interface BannerProps {
  children: React.ReactNode;
}

const Banner = ({ children }: BannerProps) => {
  return (
    <div className="bg-springBud px-5 md:px-0 py-10 mb-6 lg:mb-10 xl:mb-20 mt-4 banner page-grid">
      {children}
    </div>
  );
};

export default Banner;
