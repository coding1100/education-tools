import PlagiarismCheckerTool from "@/app/components/AiTools/PlagiarismCheckerTool/PlagiarismCheckerTool";

export const metadata = {
  title: "Plagiarism Checker | Academic Suite",
  description: "Check essays and research papers for matching text and download a similarity report.",
};

export default function PlagiarismCheckerPage() {
  return <PlagiarismCheckerTool />;
}
