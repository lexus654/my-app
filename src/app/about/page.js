// app/about/page.js
export default function About() {
  return (
    <div
      style={{ display: "flex", justifyContent: "center", margin: "2rem 0" }}
    >
      <div style={{ width: "100%", maxWidth: "560px" }}>
        {/* YouTube Embed */}
        <iframe
          width="100%"
          height="315"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
}
