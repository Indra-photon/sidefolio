import sidefolioAceternity from "public/images/toonytalesworld.webp";
import sidefolioAceternity2 from "public/images/sidefolio-aceternity-2.png";
import sidefolioAlgochurn from "public/images/fraterny.webp";
import sidefolioAlgochurn2 from "public/images/sidefolio-algochurn.png";
import sidefolioMoonbeam from "public/images/avoron.webp";
import sidefolioMoonbeam2 from "public/images/sidefolio-moonbeam-2.png";
import sidefolioTailwindMasterKit from "public/images/sidefolio-tailwindmasterkit.png";
import sidefolioTailwindMasterKit2 from "public/images/sidefolio-tailwindmasterkit-2.png";
import { Type } from "lucide-react";

export const products = [
  {
    href: "https://www.toonytalesworld.com/",
    title: "ToonyTalesWorld",
    description:
      "An AI powered platform for creating personalized animated stories for kids in a storybooks format",
    thumbnail: sidefolioAceternity,
    images: [sidefolioAceternity, sidefolioAceternity2],
    stack: ["Reactjs", "Tailwindcss", "MongoDB", "Nodejs"],
    slug: "toonytalesworld-create-storybooks-for-kids-using-ai",
    content: (
      <div>
        <p>
          <strong>ToonyTalesWorld</strong> is an AI powered platform for creating and sharing 
          animated stories for kids in a storybooks format.
        </p>
        <p>
          <strong>ToonyTalesWorld</strong> is built with a modern tech stack including
          <code>Reactjs</code>, <code>Tailwindcss</code>, <code>MongoDB</code>, and <code>Nodejs</code>.
        </p>{" "}
      </div>
    ),
  },
  {
    href: "https://www.fraterny.in/",
    title: "Fraterny",
    description:
      "A platform for connecting with like-minded individuals and building communities",
    thumbnail: sidefolioAlgochurn,
    images: [sidefolioAlgochurn, sidefolioAlgochurn2],
    stack: ["Nextjs", "Tailwindcss", "Typescript", "Supabase"],
    slug: "fraterny",
    content: (
      <div>
        <p>
          <strong>Fraterny</strong> is a platform for connecting with like-minded individuals and building communities in a villa.
        </p>
        <p>
          <strong>Fraterny</strong> is built with a modern tech stack including
          <code>Nextjs</code>, <code>Tailwindcss</code>, <code>Typescript</code>, and <code>Supabase</code>.
        </p>{" "}
      </div>
    ),
  },
  {
    href: "https://www.avoron.in/",
    title: "Avoron",
    description:
      "An ecommerce website for selling high-quality deity products and accessories",
    thumbnail: sidefolioMoonbeam,
    images: [sidefolioMoonbeam, sidefolioMoonbeam2],
    stack: ["Reactjs", "Tailwindcss", "Appwrite", "Nodejs"],
    slug: "avoron-ecommerce-website-for-deity-products",
    content: (
      <div>
        <p>
          <strong>Avoron</strong> is an ecommerce website for selling high-quality deity products and accessories.
        </p>
        <p>
          <strong>Avoron</strong> is built with a modern tech stack including
          <code>Reactjs</code>, <code>Tailwindcss</code>, <code>Appwrite</code>, and <code>Nodejs</code>.
        </p>{" "}
      </div>
    ),
  },
  // {
  //   href: "https://tailwindmasterkit.com",
  //   title: "Tailwind Master Kit",
  //   description:
  //     "A beautiful and comprehensive Tailwind CSS components library for building modern websites and applications.",
  //   thumbnail: sidefolioTailwindMasterKit,
  //   images: [sidefolioTailwindMasterKit, sidefolioTailwindMasterKit2],
  //   stack: ["Nextjs", "Tailwindcss"],
  //   slug: "tailwindmasterkit",
  //   content: (
  //     <div>
  //       <p>
  //         Sit eiusmod ex mollit sit quis ad deserunt. Sint aliqua aliqua ullamco
  //         dolore nulla amet tempor sunt est ipsum. Dolor laborum eiusmod
  //         cupidatat consectetur velit ipsum. Deserunt nisi in culpa laboris
  //         cupidatat elit velit aute mollit nisi. Officia ad exercitation laboris
  //         non cupidatat duis esse velit ut culpa et.{" "}
  //       </p>
  //       <p>
  //         Exercitation pariatur enim occaecat adipisicing nostrud adipisicing
  //         Lorem tempor ullamco exercitation quis et dolor sint. Adipisicing sunt
  //         sit aute fugiat incididunt nostrud consequat proident fugiat id.
  //         Officia aliquip laborum labore eu culpa dolor reprehenderit eu ex enim
  //         reprehenderit. Cillum Lorem veniam eu magna exercitation.
  //         Reprehenderit adipisicing minim et officia enim et veniam Lorem
  //         excepteur velit adipisicing et Lorem magna.
  //       </p>{" "}
  //     </div>
  //   ),
  // },
];
