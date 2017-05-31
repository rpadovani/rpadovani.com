<?php
// Check token
$security_file = parse_ini_file("../token.ini");
$gitlab_token = $_SERVER["HTTP_X_GITLAB_TOKEN"];

if ($gitlab_token !== $security_file["token"]) {
    echo "error 403";
    exit(0);
}

// Get data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// We want only success build on master
if ($data["ref"] !== "master" ||
    $data["build_stage"] !== "deploy" ||
    $data["build_status"] !== "success") {
  exit(0);
}

// Execute the deploy script:
shell_exec("/usr/share/nginx/html/deploy.sh {$security_file["PERSONAL_TOKEN"]} 2>&1");
