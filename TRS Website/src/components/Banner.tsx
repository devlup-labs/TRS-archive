import Logo from "../assets/IItlogo.png";

const Banner = () => {
  return (
    <div>
      <div className="fixed top-0 left-0 bg-black w-full z-10">
        <div className="text-white text-2xl p-4 flex flex-row gap-2">
          <img src={Logo} alt="IITJ Logo" className="w-12" />
          <a
            href="https://iitj.ac.in/"
            className="pl-4 pt-2 hover:text-white no-underline hover:no-underline"
          >
            Indian Institute of Technology Jodhpur
          </a>
        </div>
      </div>
    </div>
  );
};

export default Banner;
