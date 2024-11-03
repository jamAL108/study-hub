import { Attribute, Extension } from '@tiptap/core';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import { Node } from 'prosemirror-model';

export interface PaginationOptions {
  pageHeight: number;  // Total height of the page
  pageWidth: number;   // Width of the page
  pageMargin: number;  // Margin for the page
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    pagination: {
      /**
       * Set pagination options
       */
      setPaginationOptions: (options: Partial<PaginationOptions>) => ReturnType;
    };
  }
}

export const Pagination = Extension.create<PaginationOptions>({
  name: 'pagination',

  addOptions() {
    return {
      pageHeight: 1056, // Total height of the page
      pageWidth: 816,   // Width of the page
      pageMargin: 96,   // Margin for the page
    };
  },

  addCommands() {
    return {
      setPaginationOptions:
        (options: Partial<PaginationOptions>) =>
        ({ tr, dispatch }) => {
          if (dispatch) {
            tr.setMeta('paginationOptions', options);
          }
          return true;
        },
    };
  },

  addProseMirrorPlugins() {
    const pluginKey = new PluginKey('pagination');

    return [
      new Plugin({
        key: pluginKey,
        state: {
          init: () => ({ ...this.options }),
          apply: (tr, value) => {
            const newOptions = tr.getMeta('paginationOptions');
            if (newOptions) {
              return { ...value, ...newOptions };
            }
            return value;
          },
        },
        props: {
          decorations: (state) => {
            const { doc } = state;
            const decorations: Decoration[] = [];
            let currentHeight = 0; // Height used on the current page

            const options = pluginKey.getState(state);
            const { pageHeight, pageMargin } = options;

            // Calculate the total usable height of the page
            const usableHeight = pageHeight - 2 * pageMargin;

            doc.descendants((node: Node, pos: number) => {
              const domNode = this.editor.view.nodeDOM(pos) as HTMLElement;

              if (domNode) {
                const nodeHeight = node.isBlock ? domNode.offsetHeight : 0;

                // Check if the node fits in the remaining space on the current page
                if (currentHeight + nodeHeight > usableHeight) {
                  // Add remaining space decoration
                  // const heading = {
                  //   type: 'heading',
                  //   attrs: { level: 1, style: `height: ${usableHeight - currentHeight}px; line-height: 1.5;` }, // Add inline style
                  //   content: [{ type: 'text', text: 'Your Heading Text Here' }],
                  // };
                  // this.editor.commands.insertContent([heading]);

                  // Add page break decoration before adding the node
                  decorations.push(
                    Decoration.widget(pos, () => {
                      const pageBreak = document.createElement('div');
                      pageBreak.className = 'page-break';
                      pageBreak.style.height = '20px';
                      pageBreak.style.width = '100%';
                      pageBreak.style.borderTop = '1px solid #000'; // Solid line for visibility
                      pageBreak.style.marginTop = '10px';
                      pageBreak.style.marginBottom = '10px';
                      pageBreak.innerText = '--- Page Break ---'; // Optional text
                      pageBreak.style.textAlign = 'center'; // Centered text for the break
                      return pageBreak;
                    })
                  );

                  // Reset currentHeight for the new page
                  currentHeight = nodeHeight;
                } else {
                  // Node fits, increase the current height
                  currentHeight += nodeHeight;
                }
              } else {
                console.warn(`No DOM node found for position: ${pos}, node type: ${node.type.name}`);
              }
            });

            return DecorationSet.create(doc, decorations);
          },
        },
      }),
    ];
  },

  addGlobalAttributes() {
    return [
      {
        types: ['textStyle'],
        attributes: {
          class: {
            default: null,
            parseHTML: (element: HTMLElement) => element.getAttribute('class'),
            renderHTML: (attributes: Record<string, any>) => {
              if (!attributes.class) {
                return {};
              }
              return { class: attributes.class };
            },
          } as Attribute,
        },
      },
    ];
  },
});
