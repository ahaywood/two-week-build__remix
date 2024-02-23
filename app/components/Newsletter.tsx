import { Icon } from "./Icon/Icon";

const Newsletter = () => {
  return (
    <form
      className="inline-block relative pb-[100px] newsletter kwes-form"
      action="https://kwesforms.com/api/foreign/forms/toyYcLrR9215nenXgNOe"
      method="POST"
      data-success-message="Thanks for signing up! Be on the lookout for an email to confirm."
    >
      <div className="relative w-full md:w-[500px] text-left">
        <input
          type="email"
          placeholder="YOUR EMAIL"
          className="text-white text-2xl rounded-full border-[3px] border-white px-8 h-[68px] bg-black w-full pr-14"
          name="email"
          data-kw-rules="required|email"
        />
        <button
          className="absolute right-5 top-4 text-white hover:text-springBud transition-color duration-200 ease-in-out group/arrow"
          type="submit"
        >
          <div className="relative right-0 group-hover/arrow:-right-2 transition-all duration-200 ease-in-out">
            <Icon name="arrow" size="xxl" />
          </div>
          <div className="register hidden md:block text-left circle uppercase absolute -right-[257px] -top-[56px] rotate-[10deg] text-[32px] leading-none">
            Register
            <br />
            for Free
          </div>
        </button>
      </div>
    </form>
  );
};

export default Newsletter;
