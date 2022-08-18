import { Composer, Context, InlineKeyboard } from "../deps.ts";
import communities from "../communities.json" assert { type: "json" };
import pager from "../utils/pager.ts";

const composer = new Composer();
const ctxMenuText =
  "<b>Telegramdagi Rust Hamjamiyatlari yoki Guruhlari:</b>\nAgar o'zingizni guruhingizni qo'shmoqchi bo'lsangiz, bizni <a href='https://github.com/rust-lang-uz/telegram/blob/main/communities.json'>community.json</a> ni yangilang!";

composer.command("group", async (ctx: Context): Promise<void> => {
  const keyboard = new InlineKeyboard();

  for (const community of pager(1)) {
    keyboard.text(
      community.name,
      `detail_${1}_${community.telegram.replace("@", "")}`,
    ).row();
  }

  if (pager(2).length > 0) {
    keyboard.text(`Keyingi ➡️`, `group_2`);
  }

  await ctx.reply(ctxMenuText, {
    parse_mode: "HTML",
    reply_markup: keyboard,
    disable_web_page_preview: true,
  });
});

composer.callbackQuery(/^group_(\d+)$/, async (ctx: Context) => {
  const page = Number(ctx.match![1]);
  const keyboard = new InlineKeyboard();

  for (const community of pager(page)) {
    keyboard.text(
      community.name,
      `detail_${page}_${community.telegram.replace("@", "")}`,
    ).row();
  }

  if (pager(page - 1).length > 0) {
    keyboard.text(`⬅️ Oldingi`, `group_${page - 1}`);
  }

  if (pager(page + 1).length > 0) {
    keyboard.text(`Keyingi ➡️`, `group_${page + 1}`);
  }

  await ctx.editMessageText(ctxMenuText, {
    parse_mode: "HTML",
    reply_markup: keyboard,
    disable_web_page_preview: true,
  });
});

composer.callbackQuery(/^detail_(\d+)_(.*)$/, async (ctx: Context) => {
  const keyboard = new InlineKeyboard();
  const page = ctx.match![1];
  const result = communities.filter((com) =>
    com.telegram.replace("@", "") === ctx.match![2]
  );

  if (result.length) {
    const data = result[0];

    if (data.telegram) {
      keyboard.url(
        `Telegram`,
        `https://t.me/${data.telegram.replace("@", "")}`,
      );
    }

    if (data.link) {
      keyboard.url(`Web`, data.link);
    }

    keyboard.row().text(`🔙 Orqaga`, `group_${page}`);

    await ctx.editMessageText(
      `<b>${data.name}</b>` +
      `\n` +
      `\n` +
      `<i>${data.about}</i>` +
      `\n` +
      `\n` +
      `<b>Use the following buttons to get to the links:</b>`,
      {
        parse_mode: "HTML",
        reply_markup: keyboard,
      },
    );
  } else {
    await ctx.editMessageText(`<b>Ushbu guruh mavjud emas!</b>`, {
      parse_mode: "HTML",
      reply_markup: new InlineKeyboard().text(`🔙 Orqaga`, `group_${page}`),
    });
  }
});

export default composer;
