interface BannerProps {
  children: React.ReactNode;
}

const Banner = ({ children }: BannerProps) => {
  return (
    <div className="bg-springBud px-page py-10 mb-20 mt-4 banner">
      {children}
    </div>
  );
};

export default Banner;
