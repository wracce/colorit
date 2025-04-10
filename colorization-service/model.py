import torch
from main_model import MainModel, build_res_unet, lab_to_rgb  # из твоего кода
import numpy as np

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

def build_model():
    net_G = build_res_unet(n_input=1, n_output=2, size=256)
    net_G.load_state_dict(torch.load("res18-unet.pt", map_location=device))
    model = MainModel(net_G=net_G)
    model.load_state_dict(torch.load("final_model_weights.pt", map_location=device))
    model.eval()
    return model

def inference(L: torch.Tensor, ab: torch.Tensor) -> np.ndarray:
    model = build_model()
    model.net_G.eval()
    with torch.no_grad():
        ab_pred = model.net_G(L.to(device))
        rgb = lab_to_rgb(L, ab_pred)
    return rgb
