const Footer = () => {
  const currentYear = () => new Date().getFullYear();
  return (
    <footer className="p-page text-neutral-500 flex xl:justify-between flex-col xl:flex-row gap-4">
      <div>
        Copyright &copy;{currentYear()}{" "}
        <a href="https://ahhacreative.com" target="_blank" rel="noreferrer">
          Ah Ha Creative, LLC.
        </a>{" "}
        All Rights Reserved.
      </div>
      <div>
        <a href="/disclaimers">Disclaimers</a> .{" "}
        <a href="/privacy">Privacy Policy</a> .{" "}
        <a href="/terms">Terms and Conditions</a>
      </div>
    </footer>
  );
};

export default Footer;
