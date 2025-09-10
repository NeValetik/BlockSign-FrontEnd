import { ArrowRight, FileInput } from "lucide-react";

import Container from "@/components/Container";
import Button from "@/components/Form/Button";
import Image from "next/image";

const LandingPage = () => {
  return (
    <Container className="relative px-36 py-20 flex flex-col gap-48 items-center">
      <div className="absolute w-[1248px] h-[1000px] scale-110 -z-10">
        <Image src="/static/bgsvg.svg" alt="bg" width={1200} height={1000} className="size-full min-w-[1200px] min-h-[1000px]"/>
      </div>
      <div className="flex flex-col my-24 gap-36 w-full">
        <span
          className="text-5xl"
        >
          BlockSign
        </span>
        <div className="max-w-[840px] w-full flex flex-col gap-8">
          <span
            className="font-bold text-6xl"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
          </span>
          <span
            className="text-xl text-muted-foreground"
          >
            Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat.
          </span>
          <div
            className="flex gap-4"
          >
            <Button
              variant="brand"
            >
              Get started
            </Button>
            <Button
              variant="ghost"
            >
              Learn more
              <ArrowRight />
            </Button>
          </div>
        </div>
      </div>
      <div
        className="flex flex-col gap-16 items-center w-full"
      >
        <div className="flex flex-col gap items-center max-w-[800px] w-full text-center">
          <span className="text-brand text-base">
            secure your contracts
          </span>
          <span className="text-foreground font-bold text-5xl max-w-[500px] w-full">
            Lorem Ipsum dolor sit amet
          </span>
          <span className="text-3xl text-muted-foreground ">
            Lorem Ipsum dolor sit amet asdasdasdasdasd asdasdasdas asdasdasdasdasdasdasd
          </span>
        </div>
        <div className="flex flex-col gap-16 items-center w-full">
          <div className="flex justify-around w-full">
            <div
              className="flex gap-8"
            >
              <div className="text-brand-foreground w-10 h-10 flex items-center justify-center bg-brand rounded-[8px]">
                <FileInput className="size-6"/>
              </div>
              <div className="flex flex-col gap-2 max-w-[300px]">
                <div
                  className="font-bold text-2xl"
                >
                  Upload protected files 
                </div>
                <div
                  className="text-accent-foreground text-base w-full"
                >
                  Morbi viverra dui mi arcu sed. 
                  Tellus semper adipiscing suspendisse semper morbi. 
                  Odio urna massa nunc massa.
                </div>
              </div>
            </div>
            <div
              className="flex gap-8"
            >
              <div className="text-brand-foreground w-10 h-10 flex items-center justify-center bg-brand rounded-[8px]">
                <FileInput className="size-6"/>
              </div>
              <div className="flex flex-col gap-2 max-w-[300px]">
                <div
                  className="font-bold text-2xl"
                >
                  Upload protected files 
                </div>
                <div
                  className="text-accent-foreground text-base w-full"
                >
                  Morbi viverra dui mi arcu sed. 
                  Tellus semper adipiscing suspendisse semper morbi. 
                  Odio urna massa nunc massa.
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-around w-full">
            <div
              className="flex gap-8"
            >
              <div className="text-brand-foreground w-10 h-10 flex items-center justify-center bg-brand rounded-[8px]">
                <FileInput className="size-6"/>
              </div>
              <div className="flex flex-col gap-2 max-w-[300px]">
                <div
                  className="font-bold text-2xl"
                >
                  Upload protected files 
                </div>
                <div
                  className="text-accent-foreground text-base w-full"
                >
                  Morbi viverra dui mi arcu sed. 
                  Tellus semper adipiscing suspendisse semper morbi. 
                  Odio urna massa nunc massa.
                </div>
              </div>
            </div>
            <div
              className="flex gap-8"
            >
              <div className="text-brand-foreground w-10 h-10 flex items-center justify-center bg-brand rounded-[8px]">
                <FileInput className="size-6"/>
              </div>
              <div className="flex flex-col gap-2 max-w-[300px]">
                <div
                  className="font-bold text-2xl"
                >
                  Upload protected files 
                </div>
                <div
                  className="text-accent-foreground text-base w-full"
                >
                  Morbi viverra dui mi arcu sed. 
                  Tellus semper adipiscing suspendisse semper morbi. 
                  Odio urna massa nunc massa.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="flex flex-col gap-8 items-center max-w-[840px] w-full" 
      >
        <div className="flex flex-col gap-6 text-center">
          <div className="font-bold text-6xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          </div>
          <div className="text-muted-foreground text-xl">
            Anim aute id magna aliqua ad ad non deserunt sunt. 
            Qui irure qui lorem cupidatat commodo. Elit sunt amet 
            fugiat veniam occaecat.
          </div>
        </div>
        <div className="flex justify-center gap-8">
          <Button variant="brand">
            Get started
          </Button>
          <Button
            variant="ghost"
          >
            Learn more
            <ArrowRight />
          </Button>
        </div>
      </div>
    </Container>
  );
}

export default LandingPage;
