<?php

declare(strict_types=1);

return [
    /*
     * Technical ceiling for incoming rich text payloads (serialized Lexical JSON).
     *
     * MySQL JSON storage is ultimately constrained by server settings like
     * max_allowed_packet. Keep this configurable per environment.
     */
    'max_payload_bytes' => (int) env('RICH_TEXT_MAX_PAYLOAD_BYTES', 64 * 1024 * 1024),
];
