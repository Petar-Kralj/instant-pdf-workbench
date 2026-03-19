import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import HomePage from "@/pages/HomePage";
import ToolsPage from "@/pages/ToolsPage";
import MergeTool from "@/pages/tools/MergeTool";
import SplitTool from "@/pages/tools/SplitTool";
import CompressTool from "@/pages/tools/CompressTool";
import RotateReorderTool from "@/pages/tools/RotateReorderTool";
import ExtractTool from "@/pages/tools/ExtractTool";
import PdfToImagesTool from "@/pages/tools/PdfToImagesTool";
import ImagesToPdfTool from "@/pages/tools/ImagesToPdfTool";
import WatermarkTool from "@/pages/tools/WatermarkTool";
import MetadataTool from "@/pages/tools/MetadataTool";
import ExcelToPdfTool from "@/pages/tools/ExcelToPdfTool";
import WordToPdfTool from "@/pages/tools/WordToPdfTool";
import PdfToWordTool from "@/pages/tools/PdfToWordTool";
import PdfToExcelTool from "@/pages/tools/PdfToExcelTool";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/tools/merge" element={<MergeTool />} />
            <Route path="/tools/split" element={<SplitTool />} />
            <Route path="/tools/compress" element={<CompressTool />} />
            <Route path="/tools/rotate-reorder" element={<RotateReorderTool />} />
            <Route path="/tools/extract" element={<ExtractTool />} />
            <Route path="/tools/pdf-to-images" element={<PdfToImagesTool />} />
            <Route path="/tools/images-to-pdf" element={<ImagesToPdfTool />} />
            <Route path="/tools/watermark" element={<WatermarkTool />} />
            <Route path="/tools/metadata" element={<MetadataTool />} />
            <Route path="/tools/excel-to-pdf" element={<ExcelToPdfTool />} />
            <Route path="/tools/word-to-pdf" element={<WordToPdfTool />} />
            <Route path="/tools/pdf-to-word" element={<PdfToWordTool />} />
            <Route path="/tools/pdf-to-excel" element={<PdfToExcelTool />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
