'use client';

import { FC, useMemo } from "react";
import { Instagram, Github } from "lucide-react";
import Container from "../../Container";
import Link from "next/link";

const Footer: FC = () => {
  const year = useMemo(() => new Date().getFullYear(), []);

  return (
    <footer className="text-foreground py-16">
      <Container className="hidden lg:px-[156px] md:flex md:flex-col gap-[72px]">
        <div>
          <div>
            <div className="text-2xl mb-6">BlockSign</div>
          </div>
          <div className="flex gap-[86px]">
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-6">
                <p className="max-w-80">
                  Lorem ipsum dolor mego asdasdasdasdasdasdasd aasdasdasdasdasdasdasd asdasdasd
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <h3 className="font-bold text-xl">Contact us</h3>
                <div className="flex flex-row gap-6">
                  <a href="#" className="hover:opacity-80 transition-opacity">
                    <Instagram size={40} />
                  </a>
                  <a href="#" className="hover:opacity-80 transition-opacity">
                    <Github size={40} />
                  </a>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-10">
              <div className="flex flex-col gap-3">
                <h3 className="font-bold text-xl">About us</h3>
                <div className="flex flex-col text-base">
                  <Link href="/about" className="hover:opacity-80 transition-opacity">
                    Lorem ipsum
                  </Link>
                  <Link href="/contacts" className="hover:opacity-80 transition-opacity">
                    Lorem ipsum
                  </Link>
                  <Link href="#" className="hover:opacity-80 transition-opacity">
                    Lorem ipsum
                  </Link>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-xl">Information</h3>
              <div className="flex flex-col text-base">
                <Link href="/terms-and-conditions" className="hover:opacity-80 transition-opacity">
                  Lorem ipsum
                </Link>
                <Link href="/privacy-policy" className="hover:opacity-80 transition-opacity">
                  Lorem ipsum
                </Link>
                <Link href="#" className="hover:opacity-80 transition-opacity">
                  Lorem ipsum
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <h3 className="font-bold text-xl">Smth</h3>
              <div className="flex flex-col text-base">
                <Link href="#" className="hover:opacity-80 transition-opacity">
                  Lorem ipsum
                </Link>
                <Link href="#" className="hover:opacity-80 transition-opacity">
                  Lorem ipsum
                </Link>
                <Link href="#" className="hover:opacity-80 transition-opacity">
                  Lorem ipsum
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div>
          © {year} BlockSign. All rights reserved.
        </div>
      </Container>

      <Container className="md:hidden">
        <div>
          <div className="text-2xl mb-6">BlockSign</div>
        </div>
        <div className="grid grid-cols-1 gap-6 mb-4">
          <div className="flex flex-col gap-6">
            <p className="max-w-80">
              Lorem ipsum dolor mego asdasdasdasdasdasdasd aasdasdasdasdasdasdasd asdasdasd
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <div className="font-bold text-xl">Contact us</div>
            <div className="flex flex-row gap-6">
              <a href="#" className="hover:opacity-80 transition-opacity">
                <Instagram size={40} />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <Github size={40} />
              </a>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-xl">About us</h3>
            <div className="flex flex-col text-base">
              <Link href="/about" className="hover:opacity-80 transition-opacity">
                Lorem ipsum
              </Link>
              <Link href="/contacts" className="hover:opacity-80 transition-opacity">
                Lorem ipsum
              </Link>
              <Link href="#" className="hover:opacity-80 transition-opacity">
                Lorem ipsum
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-xl">Information</h3>
            <div className="flex flex-col text-base">
              <Link href="/terms-and-conditions" className="hover:opacity-80 transition-opacity">
                Lorem ipsum
              </Link>
              <Link href="/privacy-policy" className="hover:opacity-80 transition-opacity">
                Lorem ipsum
              </Link>
              <Link href="#" className="hover:opacity-80 transition-opacity">
                Lorem ipsum
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="font-bold text-xl">Smth</h3>
            <div className="flex flex-col text-base">
              <Link href="#" className="hover:opacity-80 transition-opacity">
                Lorem ipsum
              </Link>
              <Link href="#" className="hover:opacity-80 transition-opacity">
                Lorem ipsum
              </Link>
              <Link href="#" className="hover:opacity-80 transition-opacity">
                Lorem ipsum
              </Link>
            </div>
          </div>
        </div>

        <div className="mb-[80px]" />

        <div>
          © {year} BlockSign. All rights reserved.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;