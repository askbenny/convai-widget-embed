/**
 * AskBenny Widget - A custom wrapper for ElevenLabs ConvAI widget
 *
 * Usage:
 * <askbenny agent-id="your-agent-id"></askbenny>
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

  // Public API methods
  static create(agentId, container = document.body) {
    const widget = document.createElement("askbenny");
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
  !window.customElements.get("askbenny")
) {
  window.customElements.define("askbenny", AskBennyWidget);
}

// Export for module usage
export { AskBennyWidget };
export default AskBennyWidget;

// For UMD builds, attach to window
if (typeof window !== "undefined") {
  window.AskBennyWidget = AskBennyWidget;
}
