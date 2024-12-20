#!/bin/bash
source ~/miniconda3/etc/profile.d/conda.sh
conda activate doc-gen-sys

echo "Python version:"
python --version

echo -e "\nNode.js version:"
node --version

echo -e "\nnpm version:"
npm --version
