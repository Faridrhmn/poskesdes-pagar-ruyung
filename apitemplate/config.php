<?php
/**
 * Simple Config loader for environment variables
 * Supports values from $_ENV/$_SERVER and optional .env file in same directory
 */

class Config {
    private static $loaded = false;
    private static $vars = [];

    private static function loadEnvFile() {
        if (self::$loaded) return;
        self::$loaded = true;
        $envPath = __DIR__ . '/.env';
        if (!is_file($envPath)) return;
        $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        if ($lines === false) return;
        foreach ($lines as $line) {
            if (strpos(ltrim($line), '#') === 0) continue; // comment
            $pos = strpos($line, '=');
            if ($pos === false) continue;
            $key = trim(substr($line, 0, $pos));
            $val = trim(substr($line, $pos + 1));
            // Strip optional quotes
            if ((str_starts_with($val, '"') && str_ends_with($val, '"')) || (str_starts_with($val, "'") && str_ends_with($val, "'"))) {
                $val = substr($val, 1, -1);
            }
            self::$vars[$key] = $val;
        }
    }

    /**
     * Get config value with optional default
     */
    public static function get($key, $default = null) {
        self::loadEnvFile();
        if (array_key_exists($key, self::$vars)) return self::$vars[$key];
        if (isset($_ENV[$key])) return $_ENV[$key];
        if (isset($_SERVER[$key])) return $_SERVER[$key];
        $env = getenv($key);
        if ($env !== false) return $env;
        return $default;
    }
}

?>

