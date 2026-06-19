declare module 'gray-matter' {
  interface GrayMatterFile {
    data: Record<string, any>;
    content: string;
    orig: Buffer;
    language: string;
    matter: string;
    stringify: (lang: string) => string;
  }

  function matter(input: string | Buffer, options?: any): GrayMatterFile;

  export = matter;
}
