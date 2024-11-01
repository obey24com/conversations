import React, { useState, useEffect, useRef } from "react";
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

function Header() {
  const [menuOpen, setMenuOpen] = useState(false); // State for the menu
  const menuRef = useRef<HTMLDivElement | null>(null); // Ref to track the menu with proper type

  const handleClickOutside = (event: MouseEvent) => {
    // Check if the menu is open and if the click was outside the menu
    if (
      menuOpen &&
      menuRef.current &&
      !menuRef.current.contains(event.target as Node)
    ) {
      setMenuOpen(false); // Close the menu
    }
  };

  useEffect(() => {
    // Add the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]); // Run the effect when menuOpen changes

  return (
    <>
      <div className="sticky top-0 flex items-center justify-between bg-white/30 border-b border-white/10 z-50 p-2 max-w-5xl mx-auto w-full">
        {/* Powered by section in the middle */}
        <div className="text-left flex-1 md:flex hidden">
          <span className="text-[10px] text-muted-foreground/70">
            Ulocat is powered by{" "}
            <a
              href="https://obey24.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Obey24.com
            </a>
          </span>
        </div>
        {/* Logo on the left */}
        <div className="flex-1 text-center">
          <img src="/img/logo.png" alt="Logo" className="h-12 md:mx-auto" />
        </div>
        {/* Menu button on the right */}
        <div className="flex-1 text-end">
          <Button onClick={() => setMenuOpen(!menuOpen)} variant="outline">
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
      {/* ===== Header End ===== */}

      {/* Full-Screen Overlay Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-70 flex justify-center items-center transition-opacity duration-300 ease-in-out">
          <div
            ref={menuRef} // Attach the ref to the menu
            className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-1/3 max-w-md transform transition-transform duration-300 ease-in-out"
          >
            <h2 className="text-xl font-semibold text-center mb-4">Menu</h2>
            <div className="flex flex-col space-y-2">
              <a
                href="/"
                className="py-2 text-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Home
              </a>
              <a
                href="https://obey24.com/agbs/"
                className="py-2 text-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Use
              </a>
              <a
                href="https://obey24.com/datenschutz/"
                className="py-2 text-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
              <a
                href="https://obey24.com/impressum/"
                className="py-2 text-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Imprint
              </a>
              <a
                href="mailto:yourmail@gmail.com"
                className="py-2 text-center text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                Feedback
              </a>
              <Button
                onClick={() => setMenuOpen(false)}
                variant="outline"
                className="mt-4 w-full"
              >
                Close Menu
              </Button>
              <div className="text-center">
                <span className="text-[10px] text-muted-foreground/70">
                  Ulocat is powered by{" "}
                  <a
                    href="https://obey24.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Obey24.com
                  </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
