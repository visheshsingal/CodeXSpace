import FadeUp from "../components/animations/FadeUp";
import StarBackground from "../components/animations/StarBackground";
import Button from "../components/ui/Button";
import "../index.css";

export default function Hero() {
  return (
    <div className="relative mt-20">
      <div className="z-10 flex flex-col items-center justify-center text-center text-white">
        <h1 className="z-10 text-5xl font-bold md:leading-[5rem] lg:text-8xl">
          <FadeUp delay={0}>
          Build Websites <br />
          Build Your {" "}
            <span className="font-jarkarta text-primary">Future</span>
          </FadeUp>
        </h1>
        <p className="opacity-8 mt-4 w-3/4 font-[250] md:max-w-[500px]">
          <FadeUp delay={0.2}>
          Get Exclusive Notes, Resources & Community Access, Live Zoom Classes + Mentor Support = Real Learning
          </FadeUp>
        </p>
        <FadeUp delay={0.4}>
        <a href="#pricing">
          <Button text="Join the Course" className="mt-8 h-[56px] w-[149px]" /></a>
        </FadeUp>

        {/* Glow effect background */}
        <div className="glow absolute opacity-35"></div>

        {/* Stars background */}
        <StarBackground />
      </div>
    </div>
  );
}
