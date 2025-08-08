const Footer = () => {
  return (
    <footer className="mt-20 px-6 sm:px-10 md:px-20 py-10 text-white/80 bg-gradient-to-br from-[#060b29] via-[#0b132d] to-[#130f40] rounded-t-3xl shadow-2xl border-t border-white/10">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center font-black text-xl text-white">
            K
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
            LikChat
          </span>
        </div>

        {/* Tagline */}
        <p className="text-sm text-white/60 text-center md:text-right">
          © {new Date().getFullYear()} KLikChat. All rights reserved. | Spark
          real vibes with a KLik 💬
        </p>
      </div>
    </footer>
  );
};

export default Footer;
