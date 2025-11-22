"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";

export default function InteractiveButtons() {
  const router = useRouter();

  return (
    <div className="flex justify-center w-full">
      <div className="flex flex-1 gap-4 max-w-md flex-col items-stretch px-4 py-3">
        <Button
          onClick={() => router.push("/scan")}
          icon="qr_code_scanner"
          label="Scan QR Code"
          filled
        />
        <Button
          onClick={() => router.push("/table")}
          label="Enter Table Number Manually"
        />
      </div>
    </div>
  );
}