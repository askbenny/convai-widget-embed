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
    return ["agent-id"];
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

    // Create the official ElevenLabs element programmatically
    const convai = document.createElement("elevenlabs-convai");
    convai.setAttribute("agent-id", agentId);

    // Copy any additional attributes from askbenny to elevenlabs-convai
    Array.from(this.attributes).forEach((attr) => {
      if (attr.name !== "agent-id") {
        convai.setAttribute(attr.name, attr.value);
      }
    });

    this.appendChild(convai);

    // Load ElevenLabs' embed script once per page
    await this.loadElevenLabsScript();

    // Remove the ElevenLabs branding overlay after the widget loads
    this.removeElevenLabsBranding(convai);
  }

  loadElevenLabsScript() {
    return new Promise((resolve, reject) => {
      // Check if already loaded
      if (window.__EL_CONVAI_LOADED__ || this.isElevenLabsLoaded) {
        resolve();
        return;
      }

      // Check if already loading
      if (this.isElevenLabsLoading) {
        // Wait for the existing load to complete
        const checkLoaded = () => {
          if (window.__EL_CONVAI_LOADED__ || this.isElevenLabsLoaded) {
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
        window.__EL_CONVAI_LOADED__ = true;
        this.isElevenLabsLoaded = true;
        this.isElevenLabsLoading = false;
        resolve();
      };

      script.onerror = (error) => {
        console.error("Failed to load ElevenLabs ConvAI script:", error);
        this.isElevenLabsLoading = false;
        reject(error);
      };

      document.head.appendChild(script);
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
      window.__EL_CONVAI_LOADED__ ||
      window.customElements.get("elevenlabs-convai")
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
