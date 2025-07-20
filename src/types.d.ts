/**
 * Type definitions for AskBenny Widget
 */

export interface AskBennyWidgetElement extends HTMLElement {
  "agent-id": string;
}

export declare class AskBennyWidget extends HTMLElement {
  /**
   * Constructor for the AskBenny widget
   */
  constructor();

  /**
   * Observed attributes for the custom element
   */
  static readonly observedAttributes: string[];

  /**
   * Called when the element is connected to the DOM
   */
  connectedCallback(): void;

  /**
   * Called when an observed attribute changes
   */
  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null
  ): void;

  /**
   * Called when the element is disconnected from the DOM
   */
  disconnectedCallback(): void;

  /**
   * Loads the ElevenLabs widget with the specified agent ID
   */
  loadElevenLabsWidget(agentId: string): Promise<void>;

  /**
   * Loads the ElevenLabs script if not already loaded
   */
  loadElevenLabsScript(): Promise<void>;

  /**
   * Creates a new AskBenny widget element programmatically
   * @param agentId - The ElevenLabs agent ID
   * @param container - The container to append the widget to (defaults to document.body)
   * @returns The created widget element
   */
  static create(agentId: string, container?: HTMLElement): AskBennyWidget;

  /**
   * Checks if the ElevenLabs script is loaded
   * @returns True if ElevenLabs is loaded
   */
  static isElevenLabsLoaded(): boolean;
}

declare global {
  interface Window {
    AskBennyWidget: typeof AskBennyWidget;
    __EL_CONVAI_LOADED__?: boolean;
  }

  namespace JSX {
    interface IntrinsicElements {
      askbenny: React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        "agent-id": string;
      };
    }
  }
}

export default AskBennyWidget;
