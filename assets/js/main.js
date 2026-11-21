"use strict";

const menu = document.querySelector("#menu");
menu.addEventListener("click", (event) => {
  const chosenLink = event.target.closest("a");
  if (chosenLink && menu.classList.contains("show")) {
    bootstrap.Collapse.getOrCreateInstance(menu, { toggle: false }).hide();
    document.querySelector(".navbar-toggler").focus({ preventScroll: true });
  }
});

const preview = document.querySelector("#pratinjau");
const previewTitle = preview.querySelector(".modal-title");
const previewImage = preview.querySelector("img");
const previewModal = new bootstrap.Modal(preview);
let previewTrigger;

document.querySelectorAll(".gallery-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    previewTrigger = link;
    previewTitle.textContent = link.dataset.galleryTitle;
    previewImage.alt = link.querySelector("img")?.alt || previewTitle.textContent;
    previewImage.src = link.href;
    previewModal.show();
  });
});

preview.addEventListener("hidden.bs.modal", () => {
  previewImage.removeAttribute("src");
  previewTrigger?.focus();
});

const orderForm = document.querySelector("#form-pemesanan");
const orderFields = orderForm.elements;
const fieldsToValidate = [
  [orderFields.nama, (value) => value.length > 0, "Isi nama kamu."],
  [orderFields.nomor, (value) => {
    const digits = value.replace(/\D/g, "");
    return /^\+?[\d ()-]+$/.test(value) && digits.length >= 8 && digits.length <= 15;
  }, "Masukkan nomor HP yang valid, misalnya 081234567890 atau +6281234567890."],
  [orderFields.deskripsi, (value) => value.length > 0, "Isi deskripsi sepatu atau barang."],
];

fieldsToValidate.forEach(([field]) => {
  field.addEventListener("input", () => field.setCustomValidity(""));
});

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();

  fieldsToValidate.forEach(([field, isValid, message]) => {
    field.setCustomValidity(isValid(field.value.trim()) ? "" : message);
  });
  if (!orderForm.reportValidity()) return;

  const branchCard = document.getElementById(orderFields.cabang.value);
  const branchLink = branchCard.querySelector(".branch-actions a[href^='https://wa.me/']");
  const branchName = orderFields.cabang.selectedOptions[0].textContent.trim();
  const whatsappUrl = new URL(branchLink.href);

  const message = [
    `Halo Shoe.lusi ${branchName}, saya ingin memesan layanan.`,
    "",
    `Nama: ${orderFields.nama.value.trim()}`,
    `Nomor HP: ${orderFields.nomor.value.trim()}`,
    `Layanan atau paket: ${orderFields.layanan.value}`,
    `Deskripsi sepatu atau barang: ${orderFields.deskripsi.value.trim()}`,
    `Cabang tujuan: ${branchName}`,
  ].join("\n");

  whatsappUrl.searchParams.set("text", message);
  window.location.assign(whatsappUrl.href);
});

orderForm.querySelector('button[type="submit"]').disabled = false;
