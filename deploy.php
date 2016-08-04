<?php
  $file=fopen("demo.php","w");
  echo fwrite($file,$_POST);
  #show a success msg

  fclose($file);
  // <!-- shell_exec("/usr/share/nginx/html/deploy.sh 2>&1"); -->
