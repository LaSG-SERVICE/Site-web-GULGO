import Image from "next/image";
import Link from "next/link";

type Props = { href?: string; compact?: boolean; light?: boolean };

export function GulgoLogo({ href = "/", compact = false, light = false }: Props) {
  const image = (
    <span className={`gulgo-logo-stage ${compact ? "is-compact" : ""} ${light ? "is-light" : ""}`}>
      <span className="gulgo-logo-orbit orbit-one" />
      <span className="gulgo-logo-orbit orbit-two" />
      <span className="gulgo-logo-shine" />
      <Image
        src="/branding/gulgo-logo-cropped.png"
        alt="GULGO — La confiance devient un actif."
        width={720}
        height={252}
        priority
        className="gulgo-logo-image"
      />
    </span>
  );
  return href ? <Link href={href} aria-label="GULGO — accueil">{image}</Link> : image;
}
