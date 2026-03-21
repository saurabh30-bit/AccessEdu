{ pkgs }: {
  deps = [
    pkgs.python311
    pkgs.python311Packages.pip
  ];
  env = {
    PYTHONBIN = "${pkgs.python311}/bin/python3";
    PIPBIN = "${pkgs.python311Packages.pip}/bin/pip";
  };
}
