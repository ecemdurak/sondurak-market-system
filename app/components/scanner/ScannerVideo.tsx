type ScannerVideoProps = {
    videoRef: React.RefObject<HTMLVideoElement | null>;
};

export function ScannerVideo({ videoRef }: ScannerVideoProps) {
    return (
        <video
            ref={videoRef}
            style={{
                width: "100%",
                maxWidth: "500px",
                borderRadius: "12px",
                backgroundColor: "black",
            }}
        />
    );
}