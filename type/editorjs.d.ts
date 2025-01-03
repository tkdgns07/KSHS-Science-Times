declare module '@editorjs/embed' {
    import { ToolConstructable } from '@editorjs/editorjs';
  
    const Embed: ToolConstructable;
    export = Embed;
  }

  declare module '@editorjs/marker' {
    import { ToolConstructable } from '@editorjs/editorjs';
  
    const Marker: ToolConstructable;
    export = Marker;
  }
  
  declare module '@editorjs/checklist' {
    import { ToolConstructable } from '@editorjs/editorjs';
    const Checklist: ToolConstructable;
    export = Checklist;
  }
  
  declare module '@editorjs/raw' {
    import { ToolConstructable } from '@editorjs/editorjs';
    const RawTool: ToolConstructable;
    export = RawTool;
  }
  
  declare module '@editorjs/attaches' {
    import { ToolConstructable } from '@editorjs/editorjs';
    const AttachesTool: ToolConstructable;
    export = AttachesTool;
  }
  
  declare module '@editorjs/link' {
    import { ToolConstructable } from '@editorjs/editorjs';
    const LinkTool: ToolConstructable;
    export = LinkTool;
  }
  
  declare module '@editorjs/simple-image' {
    import { ToolConstructable } from '@editorjs/editorjs';
    const SimpleImage: ToolConstructable;
    export = SimpleImage;
  }
  