import { MessageSquare } from "lucide-react";
import { motion as Motion } from "framer-motion";

const NoChatSelected = () => {
  return (
    <div className="w-full h-full flex items-start md:items-center justify-center bg-base-100 pt-24 pb-32 md:pt-0 md:pb-0 px-4">
      <Motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="max-w-md w-full text-center px-6 rounded-3xl bg-base-200/60 backdrop-blur-md space-y-8 py-16 shadow-md"
      >
        {/* Logo Icon */}
        <Motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <MessageSquare className="w-10 h-10 text-primary" />
          </div>

          {/* Welcome Text */}
          <h1 className="text-3xl font-extrabold text-base-content drop-shadow-sm tracking-tight">
            Welcome to
          </h1>

          {/* KChat Glow + Pulse */}
          <div className="relative z-10 group flex items-center gap-1">
            {/* K with pulse */}
            <span className="inline-flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary to-accent text-white font-black text-lg sm:text-xl leading-none transform transition-transform group-hover:scale-105 animate-bounce-pulse">
              K
            </span>

            <span className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent transition-all duration-300 group-hover:brightness-110">
              Chat
            </span>

            {/* Glow ring */}
            <div className="absolute inset-0 rounded-xl blur-lg opacity-30 z-0 bg-gradient-to-r from-primary to-accent scale-110" />
          </div>

          <p className="text-base text-base-content/70 font-medium mt-1">
            Where real-time meets real people.
          </p>
        </Motion.div>

        {/* Instruction Text */}
        <Motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="text-base text-base-content/60 px-2 sm:px-6 leading-relaxed"
        >
          Select a chat from the sidebar to get started — or find someone new
          online!
        </Motion.p>
      </Motion.div>
    </div>
  );
};

export default NoChatSelected;
