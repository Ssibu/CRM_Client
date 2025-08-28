import { motion, AnimatePresence } from "framer-motion";
import SkeletonBox from "./SkeletonBox";

const FilePreview = ({ file, isLoading }) => (
  <AnimatePresence>
    {file && (
      <motion.div className="mt-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
        <p className="text-sm text-green-600">
          ବାଛିତ ଫାଇଲ୍‌: {file.name} ({Math.round(file.size / 1024)} KB)
        </p>
        {isLoading ? (
          <SkeletonBox />
        ) : (
          <img src={URL.createObjectURL(file)} alt="Preview" className="mt-2 rounded-md border max-h-48 object-contain" />
        )}
      </motion.div>
    )}
  </AnimatePresence>
);

export default FilePreview;
