import type { Metadata } from "next";

import NotFoundContent from "./NotFoundContent";

export const metadata: Metadata = {
  title: "Not found | Mario Daruranto",
};

const NotFound = () => (
  <main>
    <NotFoundContent />
  </main>
);

export default NotFound;
