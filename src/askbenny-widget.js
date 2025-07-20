/**
 * AskBenny Widget - A custom wrapper for ElevenLabs ConvAI widget
 *
 * Usage:
 * <ask-benny agent-id="your-agent-id"></ask-benny>
 *
 * Or programmatically:
 * import { AskBennyWidget } from '@askbenny/widget';
 * // Widget will auto-register the custom element
 */

class AskBennyWidget extends HTMLElement {
  constructor() {
    super();
    this.isElevenLabsLoaded = false;
    this.isElevenLabsLoading = false;
  }

  static get observedAttributes() {
    return ["agent-id", "hide-branding"];
  }

  connectedCallback() {
    const agentId = this.getAttribute("agent-id") || "";

    if (!agentId) {
      console.warn("AskBenny Widget: agent-id attribute is required");
      return;
    }

    this.loadElevenLabsWidget(agentId);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "agent-id" && oldValue !== newValue) {
      this.loadElevenLabsWidget(newValue || "");
    } else if (name === "hide-branding" && oldValue !== newValue) {
      // Reload the widget with new branding settings
      const agentId = this.getAttribute("agent-id") || "";
      if (agentId) {
        this.loadElevenLabsWidget(agentId);
      }
    }
  }

  disconnectedCallback() {
    // Clean up when element is removed
    this.innerHTML = "";
  }

  async loadElevenLabsWidget(agentId) {
    if (!agentId) return;

    // Clear existing content
    this.innerHTML = "";

    try {
      // Load ElevenLabs' embed script first to ensure custom element is registered
      await this.loadElevenLabsScript();

      // Now create the official ElevenLabs element after the script is loaded
      const convai = document.createElement("elevenlabs-convai");
      convai.setAttribute("agent-id", agentId);

      // Copy any additional attributes from askbenny to elevenlabs-convai
      Array.from(this.attributes).forEach((attr) => {
        if (attr.name !== "agent-id" && attr.name !== "hide-branding") {
          convai.setAttribute(attr.name, attr.value);
        }
      });

      this.appendChild(convai);

      // Handle branding based on hide-branding attribute
      const hideBranding = this.getAttribute("hide-branding") === "true";
      if (hideBranding) {
        // Remove all branding
        this.removeElevenLabsBranding(convai);
      } else {
        // Replace ElevenLabs branding with AskBenny branding
        this.replaceWithAskBennyBranding(convai);
      }
    } catch (error) {
      console.error(
        "AskBenny Widget: Failed to load ElevenLabs widget:",
        error
      );
      this.innerHTML = `<div style="padding: 1rem; color: #666; text-align: center;">Failed to load voice widget</div>`;
    }
  }

  loadElevenLabsScript() {
    return new Promise((resolve, reject) => {
      // Check if the custom element is already defined (best indicator it's loaded)
      if (
        window.customElements &&
        window.customElements.get("elevenlabs-convai")
      ) {
        window.__EL_CONVAI_LOADED__ = true;
        this.isElevenLabsLoaded = true;
        resolve();
        return;
      }

      // Check if already loaded via our flag
      if (window.__EL_CONVAI_LOADED__ || this.isElevenLabsLoaded) {
        resolve();
        return;
      }

      // Check if already loading
      if (this.isElevenLabsLoading) {
        // Wait for the existing load to complete
        const checkLoaded = () => {
          if (
            window.__EL_CONVAI_LOADED__ ||
            this.isElevenLabsLoaded ||
            (window.customElements &&
              window.customElements.get("elevenlabs-convai"))
          ) {
            resolve();
          } else {
            setTimeout(checkLoaded, 100);
          }
        };
        checkLoaded();
        return;
      }

      this.isElevenLabsLoading = true;

      const script = document.createElement("script");
      script.src = "https://unpkg.com/@elevenlabs/convai-widget-embed";
      script.async = true;

      script.onload = () => {
        // Wait a bit for the custom element to be defined
        const waitForCustomElement = () => {
          if (
            window.customElements &&
            window.customElements.get("elevenlabs-convai")
          ) {
            window.__EL_CONVAI_LOADED__ = true;
            this.isElevenLabsLoaded = true;
            this.isElevenLabsLoading = false;
            resolve();
          } else {
            setTimeout(waitForCustomElement, 50);
          }
        };
        waitForCustomElement();
      };

      script.onerror = (error) => {
        console.error("Failed to load ElevenLabs ConvAI script:", error);
        this.isElevenLabsLoading = false;
        reject(error);
      };

      // Check if script is already present
      const existingScript = document.querySelector(
        'script[src="https://unpkg.com/@elevenlabs/convai-widget-embed"]'
      );
      if (existingScript) {
        // Script exists, just wait for custom element to be defined
        const waitForExistingScript = () => {
          if (
            window.customElements &&
            window.customElements.get("elevenlabs-convai")
          ) {
            window.__EL_CONVAI_LOADED__ = true;
            this.isElevenLabsLoaded = true;
            this.isElevenLabsLoading = false;
            resolve();
          } else {
            setTimeout(waitForExistingScript, 100);
          }
        };
        waitForExistingScript();
      } else {
        document.head.appendChild(script);
      }
    });
  }

  removeElevenLabsBranding(convaiElement) {
    // Wait for the widget to fully load and render its DOM
    const checkAndRemoveOverlay = () => {
      // Look for the branding overlay within the convai element or its shadow DOM
      const overlaySelectors = [
        ".overlay",
        '[class*="overlay"]',
        '*:has-text("Powered by ElevenLabs")', // CSS4 selector for text content
      ];

      // Check regular DOM first
      for (const selector of overlaySelectors) {
        try {
          const overlay = convaiElement.querySelector(selector);
          if (overlay && this.isElevenLabsOverlay(overlay)) {
            overlay.remove();
            console.log("AskBenny: Removed ElevenLabs branding overlay");
            return true;
          }
        } catch (e) {
          // Selector might not be supported in all browsers
        }
      }

      // Check shadow DOM if available
      if (convaiElement.shadowRoot) {
        for (const selector of overlaySelectors) {
          try {
            const overlay = convaiElement.shadowRoot.querySelector(selector);
            if (overlay && this.isElevenLabsOverlay(overlay)) {
              overlay.remove();
              console.log(
                "AskBenny: Removed ElevenLabs branding overlay from shadow DOM"
              );
              return true;
            }
          } catch (e) {
            // Selector might not be supported
          }
        }
      }

      // Fallback: search for any element containing "Powered by ElevenLabs"
      const allElements = convaiElement.querySelectorAll("*");
      for (const element of allElements) {
        if (this.isElevenLabsOverlay(element)) {
          element.remove();
          console.log(
            "AskBenny: Removed ElevenLabs branding overlay (fallback method)"
          );
          return true;
        }
      }

      // Check shadow DOM elements with fallback
      if (convaiElement.shadowRoot) {
        const shadowElements = convaiElement.shadowRoot.querySelectorAll("*");
        for (const element of shadowElements) {
          if (this.isElevenLabsOverlay(element)) {
            element.remove();
            console.log(
              "AskBenny: Removed ElevenLabs branding overlay from shadow DOM (fallback method)"
            );
            return true;
          }
        }
      }

      return false;
    };

    // Try immediately
    if (checkAndRemoveOverlay()) {
      return;
    }

    // If not found immediately, set up a MutationObserver to watch for DOM changes
    const observer = new MutationObserver((mutations) => {
      if (checkAndRemoveOverlay()) {
        observer.disconnect();
      }
    });

    // Observe the convai element and its children for changes
    observer.observe(convaiElement, {
      childList: true,
      subtree: true,
      attributes: false,
    });

    // Also try periodically in case MutationObserver misses it
    let attempts = 0;
    const maxAttempts = 20; // Try for ~10 seconds
    const intervalId = setInterval(() => {
      attempts++;
      if (checkAndRemoveOverlay() || attempts >= maxAttempts) {
        clearInterval(intervalId);
        observer.disconnect();
      }
    }, 500);
  }

  isElevenLabsOverlay(element) {
    if (!element || !element.textContent) return false;

    const text = element.textContent.toLowerCase();
    const hasElevenLabsText =
      text.includes("powered by elevenlabs") || text.includes("elevenlabs");

    // Check for the specific link to ElevenLabs conversational AI
    const hasElevenLabsLink =
      element.querySelector &&
      element.querySelector('a[href*="elevenlabs.io/conversational-ai"]');

    // Check for overlay-like classes
    const hasOverlayClass =
      element.className &&
      (element.className.includes("overlay") ||
        element.className.includes("opacity-") ||
        element.className.includes("transition-opacity"));

    return hasElevenLabsText && (hasElevenLabsLink || hasOverlayClass);
  }

  replaceWithAskBennyBranding(convaiElement) {
    // Wait for the widget to fully load and render its DOM
    const checkAndReplaceOverlay = () => {
      // Look for the branding overlay within the convai element or its shadow DOM
      const overlaySelectors = [".overlay", '[class*="overlay"]'];

      // Check regular DOM first
      for (const selector of overlaySelectors) {
        try {
          const overlay = convaiElement.querySelector(selector);
          if (overlay && this.isElevenLabsOverlay(overlay)) {
            this.replaceOverlayContent(overlay);
            console.log(
              "AskBenny: Replaced ElevenLabs branding with AskBenny branding"
            );
            return true;
          }
        } catch (e) {
          // Selector might not be supported in all browsers
        }
      }

      // Check shadow DOM if available
      if (convaiElement.shadowRoot) {
        for (const selector of overlaySelectors) {
          try {
            const overlay = convaiElement.shadowRoot.querySelector(selector);
            if (overlay && this.isElevenLabsOverlay(overlay)) {
              this.replaceOverlayContent(overlay);
              console.log(
                "AskBenny: Replaced ElevenLabs branding with AskBenny branding from shadow DOM"
              );
              return true;
            }
          } catch (e) {
            // Selector might not be supported
          }
        }
      }

      // Fallback: search for any element containing "Powered by ElevenLabs"
      const allElements = convaiElement.querySelectorAll("*");
      for (const element of allElements) {
        if (this.isElevenLabsOverlay(element)) {
          this.replaceOverlayContent(element);
          console.log(
            "AskBenny: Replaced ElevenLabs branding with AskBenny branding (fallback method)"
          );
          return true;
        }
      }

      // Check shadow DOM elements with fallback
      if (convaiElement.shadowRoot) {
        const shadowElements = convaiElement.shadowRoot.querySelectorAll("*");
        for (const element of shadowElements) {
          if (this.isElevenLabsOverlay(element)) {
            this.replaceOverlayContent(element);
            console.log(
              "AskBenny: Replaced ElevenLabs branding with AskBenny branding from shadow DOM (fallback method)"
            );
            return true;
          }
        }
      }

      return false;
    };

    // Try immediately
    if (checkAndReplaceOverlay()) {
      return;
    }

    // If not found immediately, set up a MutationObserver to watch for DOM changes
    const observer = new MutationObserver((mutations) => {
      if (checkAndReplaceOverlay()) {
        observer.disconnect();
      }
    });

    // Observe the convai element and its children for changes
    observer.observe(convaiElement, {
      childList: true,
      subtree: true,
      attributes: false,
    });

    // Also try periodically in case MutationObserver misses it
    let attempts = 0;
    const maxAttempts = 20; // Try for ~10 seconds
    const intervalId = setInterval(() => {
      attempts++;
      if (checkAndReplaceOverlay() || attempts >= maxAttempts) {
        clearInterval(intervalId);
        observer.disconnect();
      }
    }, 500);
  }

  replaceOverlayContent(overlayElement) {
    // Create new AskBenny branding content
    overlayElement.innerHTML = `
      <p class="whitespace-nowrap [line-height:var(--el-overlay-padding)] text-[10px] px-3 translate-y-[calc(var(--el-overlay-padding)-1rem)]">
        <span class="opacity-30">Powered by</span> 
        <a href="https://askbenny.ca" target="_blank" class="underline cursor-pointer pointer-events-auto focus-visible:outline-none opacity-30 hover:opacity-50 focus-visible:opacity-100 focus-visible:underline-offset-2">askbenny.ca</a>
      </p>
    `;
  }

  // Public API methods
  static create(agentId, container = document.body) {
    const widget = document.createElement("ask-benny");
    widget.setAttribute("agent-id", agentId);
    container.appendChild(widget);
    return widget;
  }

  // Utility method to check if ElevenLabs is available
  static isElevenLabsLoaded() {
    return !!(
      (window.customElements &&
        window.customElements.get("elevenlabs-convai")) ||
      window.__EL_CONVAI_LOADED__
    );
  }
}

// Register the custom element
if (
  typeof window !== "undefined" &&
  window.customElements &&
  !window.customElements.get("ask-benny")
) {
  window.customElements.define("ask-benny", AskBennyWidget);
}

// Export for module usage
export { AskBennyWidget };
export default AskBennyWidget;

// For UMD builds, attach to window
if (typeof window !== "undefined") {
  window.AskBennyWidget = AskBennyWidget;
}
