import { Composition } from "remotion";
import { ProfileIntro } from "./ProfileIntro";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="ProfileIntro"
      component={ProfileIntro}
      durationInFrames={300}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
