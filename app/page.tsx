"use client";

import Header from "./ui/header";
import exifr from "exifr";
import http from "http";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [metadata, setMetadata] = useState();

  useEffect(() => {
    async function getBufferFromUrl(url: string): Promise<Buffer> {
      return new Promise((resolve) => {
        http.get(url, (response) => {
          const body: Buffer[] = [];
          response
            .on("data", (chunk: Buffer) => {
              body.push(chunk);
            })
            .on("end", () => {
              resolve(Buffer.concat(body));
            });
        });
      });
    }

    const test = async () => {
      const buffer = await getBufferFromUrl(
        "https://project.joshhills.dev/lutalike/example-raw.dng",
      );

      exifr.parse(buffer, { tiff: false, xmp: true }).then((output: any) => {
        setMetadata(output);
      });
    };

    test();
  }, [metadata]);

  return (
    <>
      <Header />
      <main>
        <Image
          width="600"
          height="600"
          src="/lutalike/example-after.jpg"
          alt=""
        />
        <pre>{JSON.stringify(metadata, null, 2)}</pre>
      </main>
    </>
  );
}
