import { useState } from "react";
import { OverlayContainer } from "./Overlay.style";

interface OverlayProps {
    content: React.ReactNode;
    isVisible: boolean;
    onClose: () => void;
}
const Overlay = ( { content, isVisible, onClose } : OverlayProps ) => {
    
    return (
        <OverlayContainer onClick={onClose} isVisible={isVisible}>
            {content}
        </OverlayContainer>
    );
}

export default Overlay;