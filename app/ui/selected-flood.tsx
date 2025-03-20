'use client'
import {useSelectedFloodWarningStateContext} from "@/app/hooks/selected-flood-hook"

export default function SelectedFlood() {
    const {selectedWarning} = useSelectedFloodWarningStateContext();
    if(selectedWarning) {
        return(
            <div>
                <p>testing testing</p>
            </div>
        );
    }
}