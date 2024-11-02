// Previous imports remain the same...

export function TranslationInterface() {
  // Previous state and functions remain the same...

  return (
    <div className="flex flex-col h-screen bg-[#fafafa]">
      <Header />

      <div
        className="relative flex-1 overflow-hidden"
        style={{
          background: "linear-gradient(to top, #efefef, #ffffff)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
      >
        {isLoading && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce" />
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}

        <div
          ref={scrollRef}
          className="max-w-5xl mx-auto w-full h-full overflow-y-auto space-y-4 px-4 mb-4"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={cn(
                "p-4 rounded-lg max-w-[85%] mx-auto transition-opacity duration-500",
                "bg-white text-slate-900 border border-[#AAAAAA]",
                index === 0 ? "mt-4" : "",
                "opacity-0 animate-fade-in opacity-100"
              )}
            >
              <p className="text-sm opacity-70">{message.text}</p>
              <div className="mt-2 flex flex-col items-start gap-2 relative">
                <p className="font-medium flex-1">{message.translation}</p>
                <div className="flex justify-end w-full border-y border-[#AAAAAA]/10">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-[#AAAAAA] hover:text-black hover:bg-[#AAAAAA]/10"
                    onClick={() => {
                      if (isPlaying === index) {
                        audioRef.current?.pause();
                        setIsPlaying(null);
                      } else {
                        playTranslation(message.translation, index);
                      }
                    }}
                  >
                    <Volume2
                      className={cn(
                        "h-4 w-4",
                        isPlaying === index && "animate-pulse"
                      )}
                    />
                  </Button>
                  <Button
                    onClick={() => copyToClipboard(message.translation)}
                    className="shrink-0 text-[#AAAAAA] hover:text-black hover:bg-[#AAAAAA]/10"
                    aria-label="Copy translation"
                    variant="ghost"
                    size="icon"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {message.cultural && (
                <p className="mt-2 text-sm opacity-70 border-t border-primary-foreground/20 pt-2">
                  {message.cultural}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Rest of the component remains the same... */}
    </div>
  );
}
