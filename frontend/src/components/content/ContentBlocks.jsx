const IMAGE_RE = /^!\[.*?\]\((.+?)\)$/;
const VIDEO_RE = /^\[video\]\((.+?)\)$/;

export default function ContentBlocks({ content }) {
  const blocks = String(content || "")
    .split("\n\n")
    .map((block) => block.trim())
    .filter(Boolean);

  return (
    <div className="content-blocks">
      {blocks.map((block, index) => {
        const imageMatch = block.match(IMAGE_RE);
        if (imageMatch) {
          return (
            <figure key={index} className="content-blocks__figure">
              <img src={imageMatch[1]} alt="" loading="lazy" />
            </figure>
          );
        }

        const videoMatch = block.match(VIDEO_RE);
        if (videoMatch) {
          return (
            <figure key={index} className="content-blocks__figure">
              <video src={videoMatch[1]} controls playsInline />
            </figure>
          );
        }

        return (
          <p key={index} className="content-blocks__paragraph">
            {block}
          </p>
        );
      })}
    </div>
  );
}
